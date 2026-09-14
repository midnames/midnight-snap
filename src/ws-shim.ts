// Browser WebSocket API over MetaMask's snap_openWebSocket. The snap sandbox has no WebSocket, and
// graphql-ws (indexer) and @polkadot/rpc-provider (node) need one. Events come through onWebSocketEvent.
import type { WebSocketEvent } from "@metamask/snaps-sdk";

type Handler = ((ev: any) => void) | null;

export const wsStats = { constructed: 0, opened: 0, openErrors: [] as string[], sent: 0, sendErrors: [] as string[], events: { open: 0, message: 0, close: 0 }, unknownIdEvents: 0, lastError: "" };
const byId = new Map<string, SnapWebSocket>();
const pending = new Map<string, WebSocketEvent[]>(); // Events that came before the id was known.

export class SnapWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  readonly CONNECTING = 0; readonly OPEN = 1; readonly CLOSING = 2; readonly CLOSED = 3;

  readyState = 0;
  protocol = "";
  onopen: Handler = null;
  onmessage: Handler = null;
  onclose: Handler = null;
  onerror: Handler = null;
  private id: string | undefined;
  private queue: Array<string | number[]> = [];

  constructor(readonly url: string, protocols?: string | string[]) {
    const list = protocols === undefined ? undefined : ([] as string[]).concat(protocols);
    this.protocol = list?.[0] ?? "";
    wsStats.constructed++;
    // MetaMask allows one connection per (snap, url, protocol), and the wallet SDK opens several to
    // the indexer. A unique query parameter makes each URL different.
    const u = new URL(url);
    u.searchParams.set("mmws", String(wsStats.constructed));
    const openUrl = u.toString();
    snap.request({ method: "snap_openWebSocket", params: list ? { url: openUrl, protocols: list } : { url: openUrl } })
      .then((id) => {
        this.id = id as string;
        if (this.readyState >= 2) {
          // close() was called before the socket opened.
          void snap.request({ method: "snap_closeWebSocket", params: { id: this.id } }).catch(() => undefined);
          this.finishClose(1000, "", true);
          return;
        }
        byId.set(this.id, this);
        for (const m of this.queue) void this.rawSend(m);
        this.queue = [];
        const early = pending.get(this.id);
        pending.delete(this.id);
        early?.forEach((e) => this.handle(e));
      })
      .catch((err) => {
        wsStats.openErrors.push(`${url}: ${err?.message ?? JSON.stringify(err)}`);
        this.readyState = 3;
        this.onerror?.({ type: "error", message: String(err), error: err });
        this.onclose?.({ type: "close", code: 1006, reason: String(err), wasClean: false });
      });
  }

  send(data: string | ArrayBuffer | ArrayBufferView) {
    const msg = typeof data === "string" ? data : Array.from(toBytes(data));
    if (this.id === undefined) { this.queue.push(msg); return; }
    void this.rawSend(msg);
  }

  private rawSend(message: string | number[]) {
    wsStats.sent++;
    return snap.request({ method: "snap_sendWebSocketMessage", params: { id: this.id!, message } })
      .catch((err) => { wsStats.sendErrors.push(err?.message ?? JSON.stringify(err)); this.onerror?.({ type: "error", message: String(err), error: err }); });
  }

  close(code?: number, reason?: string) {
    if (this.readyState >= 2) return;
    this.readyState = 2;
    if (this.id === undefined) return;
    void snap.request({ method: "snap_closeWebSocket", params: { id: this.id } }).catch(() => undefined);
    // If MetaMask sends no close event, send one after 1 s so that consumers do not wait.
    setTimeout(() => { if (this.readyState !== 3) this.finishClose(code ?? 1000, reason ?? "", true); }, 1000);
  }

  private finishClose(code: number, reason: string, wasClean: boolean) {
    this.readyState = 3;
    if (this.id) byId.delete(this.id);
    this.onclose?.({ type: "close", code, reason, wasClean });
  }

  handle(ev: WebSocketEvent) {
    switch (ev.type) {
      case "open":
        this.readyState = 1;
        this.onopen?.({ type: "open" });
        break;
      case "message": {
        const data = ev.data.type === "text" ? ev.data.message : new Uint8Array(ev.data.message).buffer;
        this.onmessage?.({ type: "message", data });
        break;
      }
      case "close":
        this.finishClose(ev.code, ev.reason ?? "", ev.wasClean ?? false);
        break;
    }
  }
}

function toBytes(d: ArrayBuffer | ArrayBufferView): Uint8Array {
  return d instanceof ArrayBuffer ? new Uint8Array(d) : new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
}

/** Call from the snap's `onWebSocketEvent`. */
export function dispatchWebSocketEvent(ev: WebSocketEvent) {
  wsStats.events[ev.type]++;
  if (ev.type === "open") wsStats.opened++;
  const ws = byId.get(ev.id);
  if (ws) ws.handle(ev);
  else { wsStats.unknownIdEvents++; pending.set(ev.id, [...(pending.get(ev.id) ?? []), ev]); }
}

// graphql-ws and @polkadot/x-ws read the global when they load.
(globalThis as any).WebSocket = SnapWebSocket;
