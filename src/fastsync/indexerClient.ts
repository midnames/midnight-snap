// Small GraphQL client for fast sync: HTTP queries with retry, and one graphql-ws socket for all
// subscriptions. MetaMask allows one socket per URL (see src/ws-shim.ts), so share one connection.

export interface IndexerHttp {
  query<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
}

export interface SubscriptionBounds {
  /**
   * End the subscription after this much silence, with the items that came. Some subscriptions send
   * history, then wait for new blocks, and send nothing when there is no history (`dustGenerations`).
   */
  readonly idleMs?: number;
  /** Maximum time. The subscription fails when this time ends. */
  readonly maxMs?: number;
}

export interface IndexerSocket {
  /** Run a subscription to its end and collect the payloads. Use `idleMs` if it does not end by itself. */
  collect<T>(query: string, variables: Record<string, unknown>, bounds?: SubscriptionBounds): Promise<T[]>;
  /** Long subscription as an async iterable. Ends on `complete`. Throws on `error` or close. */
  subscribe<T>(query: string, variables: Record<string, unknown>): AsyncGenerator<T>;
  close(): void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * HTTP client with retry. An indexer under load can send an HTML 502, so check that the body is JSON.
 * A lost query stops a dust chain and gives a wrong balance without an error, so retry transient failures.
 * A GraphQL error is an answer, not a transient failure: do not retry it.
 */
export const makeHttp = (url: string, fetchImpl: typeof fetch = fetch, retries = 4): IndexerHttp => ({
  async query<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    for (let attempt = 1; ; attempt++) {
      let body: { data?: T; errors?: unknown };
      try {
        const response = await fetchImpl(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });
        const text = await response.text();
        if (!text.trimStart().startsWith("{")) throw new Error(`indexer returned non-JSON (${response.status})`);
        body = JSON.parse(text);
        if (!body.errors && !body.data) throw new Error("indexer returned no data");
      } catch (error) {
        if (attempt >= retries) throw error;
        await sleep(300 * 2 ** (attempt - 1));
        continue;
      }
      if (body.errors) throw new Error(`indexer error: ${JSON.stringify(body.errors).slice(0, 200)}`);
      return body.data!;
    }
  },
});

/** Run tasks with a concurrency limit. The results keep the input order. */
export const mapWithConcurrency = async <T, R>(
  items: ReadonlyArray<T>,
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await task(items[index]!, index);
    }
  });
  await Promise.all(workers);
  return results;
};

type Pending = {
  /** Called for each `next` message. */
  readonly onNext: (data: unknown) => void;
  /** Called one time: on `complete`, on `error`, when a bound ends, or when the socket closes. */
  readonly onEnd: (error?: Error) => void;
};

/** Open one graphql-ws connection for all operations. */
export const makeSocket = (url: string, WebSocketImpl: typeof WebSocket = WebSocket): IndexerSocket => {
  let socket: WebSocket | null = null;
  let ready: Promise<WebSocket> | null = null;
  let nextId = 1;
  const pending = new Map<string, Pending>();

  const settle = (id: string, error?: Error) => {
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    entry.onEnd(error);
  };

  const failAll = (error: Error) => {
    for (const id of [...pending.keys()]) settle(id, error);
    socket = null;
    ready = null;
  };

  const connect = (): Promise<WebSocket> => {
    if (ready) return ready;
    ready = new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocketImpl(url, "graphql-transport-ws");
      const openTimer = setTimeout(() => reject(new Error("indexer socket connect timed out")), 20000);
      ws.addEventListener("open", () => ws.send(JSON.stringify({ type: "connection_init", payload: {} })));
      ws.addEventListener("message", (event: MessageEvent) => {
        const message = JSON.parse(String(event.data)) as { type: string; id?: string; payload?: { data?: unknown; errors?: unknown } };
        if (message.type === "connection_ack") {
          clearTimeout(openTimer);
          socket = ws;
          resolve(ws);
          return;
        }
        if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          return;
        }
        if (!message.id) return;
        if (message.type === "next") {
          if (message.payload?.errors) {
            settle(message.id, new Error(JSON.stringify(message.payload.errors).slice(0, 200)));
            return;
          }
          pending.get(message.id)?.onNext(message.payload?.data);
        } else if (message.type === "complete") {
          settle(message.id);
        } else if (message.type === "error") {
          settle(message.id, new Error(JSON.stringify(message.payload).slice(0, 200)));
        }
      });
      ws.addEventListener("error", () => {
        clearTimeout(openTimer);
        failAll(new Error("indexer socket error"));
        reject(new Error("indexer socket error"));
      });
      ws.addEventListener("close", () => failAll(new Error("indexer socket closed")));
    });
    return ready;
  };

  /** Tell the server to stop an operation. */
  const sendComplete = (ws: WebSocket, id: string) => {
    try {
      ws.send(JSON.stringify({ id, type: "complete" }));
    } catch {
      /* The socket is already closed. */
    }
  };

  return {
    async collect<T>(query: string, variables: Record<string, unknown>, bounds: SubscriptionBounds = { maxMs: 30000 }): Promise<T[]> {
      const ws = await connect();
      const id = String(nextId++);
      return new Promise<T[]>((resolve, reject) => {
        const items: T[] = [];
        let idleTimer: ReturnType<typeof setTimeout> | undefined;
        const stop = (error?: Error) => {
          sendComplete(ws, id);
          settle(id, error);
        };
        const hardTimer = bounds.maxMs ? setTimeout(() => stop(new Error(`subscription ${id} exceeded ${bounds.maxMs}ms`)), bounds.maxMs) : undefined;
        const bumpIdle = () => {
          if (!bounds.idleMs) return;
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => stop(), bounds.idleMs); // Silence is a result, not an error.
        };
        pending.set(id, {
          onNext: (data) => {
            items.push(data as T);
            bumpIdle();
          },
          onEnd: (error) => {
            clearTimeout(idleTimer);
            clearTimeout(hardTimer);
            if (error) reject(error);
            else resolve(items);
          },
        });
        // Start the idle timer before subscribing: an empty range sends no payload.
        bumpIdle();
        ws.send(JSON.stringify({ id, type: "subscribe", payload: { query, variables } }));
      });
    },

    async *subscribe<T>(query: string, variables: Record<string, unknown>): AsyncGenerator<T> {
      const ws = await connect();
      const id = String(nextId++);
      // Unbounded queue. The stream has only this wallet's transactions. Add a limit if a
      // wallet has enough history to fill memory.
      const queue: T[] = [];
      let done: Error | true | null = null;
      let wake: (() => void) | null = null;
      const signal = () => {
        const w = wake;
        wake = null;
        w?.();
      };
      pending.set(id, {
        onNext: (data) => {
          queue.push(data as T);
          signal();
        },
        onEnd: (error) => {
          done = error ?? true;
          signal();
        },
      });
      ws.send(JSON.stringify({ id, type: "subscribe", payload: { query, variables } }));
      try {
        for (;;) {
          while (queue.length > 0) yield queue.shift() as T;
          if (done !== null) {
            if (done !== true) throw done;
            return;
          }
          await new Promise<void>((resolve) => {
            wake = resolve;
          });
        }
      } finally {
        // On `break`, `throw` or an Effect interrupt.
        if (done === null) {
          sendComplete(ws, id);
          pending.delete(id);
        }
      }
    },

    close() {
      try {
        socket?.close();
      } catch {
        /* Nothing to do. */
      }
      failAll(new Error("indexer socket closed by caller"));
    },
  };
};

/** `https://host/api/v4/graphql` to `wss://host/api/v4/graphql/ws`. */
export const wsUrlFor = (indexerHttpUrl: string): string => `${indexerHttpUrl.replace(/^http/, "ws").replace(/\/$/, "")}/ws`;
