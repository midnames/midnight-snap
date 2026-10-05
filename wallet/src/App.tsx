// The wallet site of the Midnight Snap. It calls the snap's wallet methods with wallet_invokeSnap. A production
// snap answers them only for its SNAP_WALLET_ORIGIN, a development snap also for localhost (README, "Wallet site").
import { useEffect, useRef, useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import { provider } from '../../connector/src/index.ts';
import { addressKind, applyTheme, useLocal, type Contact, type Theme } from './local';
import {
  DUST_DECIMALS,
  NATIVE,
  NIGHT_DECIMALS,
  SNAP_ID,
  decimalsOf,
  formatUnits,
  invoke,
  isName,
  message,
  parseUnits,
  setTokenNames,
  shortId,
  tokenName,
  type Accounts,
  type HistoryEntry,
  type Kind,
  type Network,
  type Summary,
  type SyncOptions,
  type SyncProgress,
  type TransferOutput,
} from './snap';

type Wallet = { network: Network; accounts: Accounts; summary: Summary | null; sites: string[]; options: SyncOptions };
type History = { total: number; entries: HistoryEntry[] };
type Run = (label: string, fn: () => Promise<string | void>) => Promise<void>;

const PAGE = 20;

const ago = (t: number) => {
  const s = Math.round((Date.now() - t) / 1000);
  return s < 60 ? `${s} s ago` : s < 3600 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
};

async function load(): Promise<Wallet> {
  const [network, accounts, summary, sites, options] = await Promise.all([
    invoke<Network>('midnight_getNetwork'),
    invoke<Accounts>('midnight_getAccounts'),
    invoke<Summary | null>('midnight_getSummary'),
    invoke<string[]>('midnight_getSites'),
    invoke<SyncOptions>('midnight_getSyncOptions'),
  ]);
  return { network, accounts, summary, sites, options };
}

export function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [history, setHistory] = useState<History>({ total: 0, entries: [] });
  const [busy, setBusy] = useState<{ label: string; since: number } | null>(null);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);
  const [theme, setTheme] = useLocal<Theme>('theme', 'system');
  const [names, setNames] = useLocal<Record<string, string>>('tokenNames', {});
  const [contacts, setContacts] = useLocal<Contact[]>('addressBook', []);
  setTokenNames(names);

  /** Wallet operations save a new summary and history when they end. */
  async function refresh() {
    const [w, h] = await Promise.all([load(), invoke<History>('midnight_getHistory', { page: 0, pageSize: PAGE })]);
    setWallet(w);
    setHistory(h);
  }

  /** One operation at a time: the snap runs wallet operations one after the other anyway. */
  const run: Run = async (label, fn) => {
    setBusy({ label, since: Date.now() });
    setNotice(null);
    try {
      const text = await fn();
      if (text) setNotice({ error: false, text });
    } catch (e) {
      setNotice({ error: true, text: message(e) });
    } finally {
      setBusy(null);
    }
  };

  async function syncNow() {
    const r = await invoke<{ synced: boolean; error?: string }>('midnight_sync');
    await refresh();
    if (r.error) throw new Error(`Sync failed: ${r.error}`);
    return r.synced ? undefined : 'Sync is incomplete. Sync again to continue.';
  }

  /** The first transfer on a new snap executor can crash the snap, so sync after each connect (README, Limits). */
  const connect = () =>
    run('Connecting', async () => {
      const p = await provider();
      const installed = (await p.request({ method: 'wallet_getSnaps' })) as Record<string, unknown>;
      if (!installed?.[SNAP_ID]) await p.request({ method: 'wallet_requestSnaps', params: { [SNAP_ID]: {} } });
      await refresh();
      setBusy({ label: 'Syncing', since: Date.now() });
      return syncNow();
    });

  // Connect without a click when this site already has the snap. wallet_getSnaps shows no MetaMask window.
  useEffect(() => {
    provider()
      .then((p) => p.request({ method: 'wallet_getSnaps' }))
      .then((installed) => (installed as Record<string, unknown>)?.[SNAP_ID] && connect())
      .catch(() => undefined);
  }, []);

  if (!wallet) {
    return (
      <main className="center">
        <h1>Midnight Wallet</h1>
        <p className="muted">A Midnight wallet in MetaMask. Your keys stay in MetaMask; this page only asks the snap.</p>
        <button className="primary" disabled={!!busy} onClick={connect}>
          {busy ? `${busy.label}…` : 'Connect MetaMask'}
        </button>
        {notice && <p className={notice.error ? 'error' : 'muted'}>{notice.text}</p>}
        <p className="muted small">Snap: {SNAP_ID}</p>
      </main>
    );
  }

  const { summary, accounts, network } = wallet;
  const tokens = summary?.tokens;
  return (
    <main>
      <header>
        <h1>Midnight Wallet</h1>
        <select
          aria-label="Network"
          value={network.networkId}
          disabled={!!busy}
          onChange={(e) =>
            run('Switching network', async () => {
              await invoke('midnight_setNetwork', { networkId: e.target.value });
              await refresh();
              setBusy({ label: 'Syncing', since: Date.now() });
              return syncNow();
            })
          }
        >
          {network.available.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <select
          aria-label="Theme"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value as Theme);
            applyTheme(e.target.value as Theme);
          }}
        >
          <option value="system">System theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </header>

      <Status busy={busy} notice={notice} summary={summary} />

      <section className="balances">
        {/* A summary from an older snap has only the sum of all tokens of each kind. */}
        <Balance label="NIGHT" value={formatUnits(tokens ? (tokens.unshielded[NATIVE] ?? '0') : (summary?.unshielded ?? '0'), NIGHT_DECIMALS)} />
        <Balance label="Shielded NIGHT" value={formatUnits(tokens ? (tokens.shielded[NATIVE] ?? '0') : (summary?.shielded ?? '0'), NIGHT_DECIMALS)} />
        <Balance label="DUST" value={formatUnits(summary?.dust ?? '0', DUST_DECIMALS, 4)} />
      </section>
      <div className="row">
        <button disabled={!!busy} onClick={() => run('Syncing', syncNow)}>
          Sync
        </button>
      </div>

      {tokens && (
        <section>
          <h2>Tokens</h2>
          {(['unshielded', 'shielded'] as const).flatMap((kind) =>
            Object.entries(tokens[kind]).map(([type, amount]) => (
              <div key={kind + type} className="item">
                <span title={type}>
                  {type === NATIVE ? <strong>NIGHT</strong> : <TokenName token={type} names={names} setNames={setNames} />}{' '}
                  <span className="muted small">{kind}</span>
                </span>
                <span className="mono">{formatUnits(amount, decimalsOf(type))}</span>
              </div>
            )),
          )}
          {!Object.keys(tokens.unshielded).length && !Object.keys(tokens.shielded).length && <p className="muted">No tokens.</p>}
        </section>
      )}

      <Send busy={!!busy} contacts={contacts} networkId={network.networkId} summary={summary} proving={wallet.options.provingStrategy} run={run} refresh={refresh} />

      <Dust busy={!!busy} summary={summary} run={run} refresh={refresh} />

      <Activity
        history={history}
        busy={!!busy}
        more={() =>
          run('Loading activity', async () => {
            const next = await invoke<History>('midnight_getHistory', { page: history.entries.length / PAGE, pageSize: PAGE });
            setHistory({ total: next.total, entries: [...history.entries, ...next.entries] });
          })
        }
      />

      <section>
        <h2>Receive</h2>
        <Copy label="Unshielded address" value={accounts.unshielded} qr />
        <Copy label="Shielded address" value={accounts.shielded} qr />
        <Copy label="DUST public key" value={accounts.dustPublicKey} />
      </section>

      <AddressBook contacts={contacts} setContacts={setContacts} networkId={network.networkId} />

      {!!summary?.names?.length && (
        <section>
          <h2>Names</h2>
          {summary.names.map((n) => (
            <div key={n.name} className="item">
              <strong>{n.name}</strong>
              <span className="mono small">{n.did ?? 'no DID'}</span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2>Connected sites</h2>
        {wallet.sites.length === 0 && <p className="muted">No site is connected on {network.networkId}.</p>}
        {wallet.sites.map((site) => (
          <div key={site} className="item">
            <span>{site}</span>
            <button
              disabled={!!busy}
              onClick={() =>
                run('Revoking', async () => {
                  await invoke('midnight_revokeSite', { origin: site });
                  await refresh();
                })
              }
            >
              Revoke
            </button>
          </div>
        ))}
      </section>

      <Settings busy={!!busy} options={wallet.options} run={run} refresh={refresh} />
      <NetworkSettings busy={!!busy} network={network} run={run} refresh={refresh} />

      <section>
        <h2>Reset</h2>
        <p className="muted small">
          Deletes the wallet state, the settings and the site connections of the snap. Your keys stay in MetaMask. The next sync starts from zero.
        </p>
        <button
          className="danger"
          disabled={!!busy}
          onClick={() =>
            run('Resetting (confirm in MetaMask)', async () => {
              await invoke('midnight_reset');
              await refresh();
              return 'Reset. Sync to load the wallet again.';
            })
          }
        >
          Reset the snap
        </button>
      </section>
    </main>
  );
}

/** The busy operation with its sync progress, or the last result. */
function Status({ busy, notice, summary }: { busy: { label: string; since: number } | null; notice: { error: boolean; text: string } | null; summary: Summary | null }) {
  const [progress, setProgress] = useState<SyncProgress>(null);
  const [, tick] = useState(0);
  const first = useRef<{ at: number; done: number } | null>(null);

  // The snap answers getSyncProgress while a wallet request runs.
  useEffect(() => {
    setProgress(null);
    first.current = null;
    if (!busy) return;
    const id = setInterval(() => {
      tick((n) => n + 1);
      invoke<SyncProgress>('midnight_getSyncProgress').then(setProgress, () => undefined);
    }, 2000);
    return () => clearInterval(id);
  }, [busy]);

  if (!busy) {
    return (
      <div className={`status ${notice?.error ? 'error' : ''}`} role="status">
        {notice?.text ?? (summary ? `Last sync ${ago(summary.at)}${summary.synced ? '' : ' (incomplete)'}` : 'Not synced yet')}
      </div>
    );
  }

  let detail = '';
  if (progress && !progress.synced) {
    const parts = (['shielded', 'unshielded', 'dust'] as const).map((k) => {
      const applied = Number(progress[k].applied), highest = Number(progress[k].highest);
      return { k, applied: Number.isFinite(applied) ? applied : 0, highest: Number.isFinite(highest) ? highest : 0 };
    });
    const done = parts.reduce((a, p) => a + Math.min(p.applied, p.highest), 0);
    const total = parts.reduce((a, p) => a + p.highest, 0);
    first.current ??= { at: progress.at, done };
    const rate = (done - first.current.done) / Math.max(1, progress.at - first.current.at);
    const eta = rate > 0 && total > done ? ` · about ${Math.ceil((total - done) / rate / 1000)} s left` : '';
    // The SDK reports 0 as the highest index until it knows the chain tip.
    const known = parts.filter((p) => p.highest > 0);
    detail = known.length ? ` · ${known.map((p) => `${p.k} ${Math.min(100, Math.floor((100 * p.applied) / p.highest))}%`).join(', ')}${eta}` : ' · connecting';
  } else if (progress?.synced) {
    detail = ' · synced';
  }
  return (
    <div className="status" role="status">
      {busy.label}… {Math.round((Date.now() - busy.since) / 1000)} s{detail}
    </div>
  );
}

function Balance({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="muted small">{label}</span>
      <span className="amount">{value}</span>
    </div>
  );
}

function Copy({ label, value, qr }: { label: string; value: string; qr?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  return (
    <div className="copy">
      <span className="muted small">{label}</span>
      <button
        className="mono"
        title="Copy"
        onClick={() => navigator.clipboard.writeText(value).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1500)))}
      >
        {copied ? 'Copied' : value}
      </button>
      {qr && (
        <details onToggle={(e) => (e.currentTarget.open && !image ? QRCode.toDataURL(value, { margin: 0, width: 320 }).then(setImage) : undefined)}>
          <summary className="small">QR code</summary>
          {image && <img className="qr" src={image} alt={`QR code of the ${label.toLowerCase()}`} />}
        </details>
      )}
    </div>
  );
}

/** A token's local name, with a rename field. Only this browser sees the name. */
function TokenName({ token, names, setNames }: { token: string; names: Record<string, string>; setNames: (n: Record<string, string>) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  if (draft === null) {
    return (
      <span className="inline">
        <strong>{tokenName(token)}</strong>
        <button type="button" className="link small" onClick={() => setDraft(names[token] ?? '')}>
          Rename
        </button>
      </span>
    );
  }
  const save = () => {
    const { [token]: _, ...rest } = names;
    setNames(draft.trim() ? { ...rest, [token]: draft.trim() } : rest);
    setDraft(null);
  };
  return (
    <span className="inline">
      <input aria-label="Token name" autoFocus value={draft} placeholder={shortId(token)} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
      <button type="button" onClick={save}>
        Save
      </button>
    </span>
  );
}

/** Saved addresses, in this browser. The Send form picks from them. */
function AddressBook({ contacts, setContacts, networkId }: { contacts: Contact[]; setContacts: (c: Contact[]) => void; networkId: string }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const kind = addressKind(address);
  const error = !address.trim() ? '' : !kind ? 'Not a Midnight address' : kind.network !== networkId ? `This address is for ${kind.network}` : '';

  const add = (e: FormEvent) => {
    e.preventDefault();
    setContacts([...contacts.filter((c) => c.address !== address.trim()), { name: name.trim(), address: address.trim() }].sort((a, b) => a.name.localeCompare(b.name)));
    setName('');
    setAddress('');
  };

  const shown = contacts.filter((c) => addressKind(c.address)?.network === networkId);
  return (
    <section>
      <h2>Address book</h2>
      {shown.length === 0 && <p className="muted">No saved addresses on {networkId}.</p>}
      {shown.map((c) => (
        <div key={c.address} className="item">
          <span>
            <strong>{c.name}</strong> <span className="muted small">{addressKind(c.address)?.kind}</span>
            <br />
            <span className="mono small muted">{c.address}</span>
          </span>
          <span className="row nowrap">
            <button type="button" onClick={() => (setName(c.name), setAddress(c.address))}>
              Edit
            </button>
            <button type="button" onClick={() => setContacts(contacts.filter((x) => x.address !== c.address))}>
              Delete
            </button>
          </span>
        </div>
      ))}
      <form onSubmit={add}>
        <label>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alice" />
        </label>
        <label>
          Address
          <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="mn_addr_… or mn_shield-addr_…" />
        </label>
        {error ? <p className="small error">{error}</p> : kind && <p className="small muted">{kind.kind === 'unshielded' ? 'An' : 'A'} {kind.kind} address.</p>}
        <button disabled={!!error || !kind}>Save address</button>
      </form>
      <p className="muted small">Saved in this browser only.</p>
    </section>
  );
}

type Row = { type: Kind; token: string; to: string; amount: string };
const emptyRow = (): Row => ({ type: 'unshielded', token: NATIVE, to: '', amount: '' });

function Send(props: { busy: boolean; contacts: Contact[]; networkId: string; summary: Summary | null; proving: string; run: Run; refresh: () => Promise<void> }) {
  const { busy, summary, proving, run, refresh } = props;
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [fee, setFee] = useState<string | null>(null);
  const balance = (r: Row) => BigInt(summary?.tokens?.[r.type][r.token] ?? '0');
  const update = (next: Row[]) => (setRows(next), setFee(null));

  // Each row's amount in atomic units, or its error. Then the total of each token against its balance.
  const parsed = rows.map((r): { value?: bigint; error: string } => {
    if (!r.amount.trim()) return { error: '' };
    try {
      const value = parseUnits(r.amount, decimalsOf(r.token));
      return value > 0n ? { value, error: '' } : { error: 'Enter more than 0' };
    } catch (e) {
      return { error: message(e) };
    }
  });
  const spent = new Map<string, bigint>();
  rows.forEach((r, i) => spent.set(`${r.type}:${r.token}`, (spent.get(`${r.type}:${r.token}`) ?? 0n) + (parsed[i]!.value ?? 0n)));
  const over = rows.map((r) => (spent.get(`${r.type}:${r.token}`) ?? 0n) > balance(r));
  const valid = rows.every((r, i) => r.to.trim() && parsed[i]!.value !== undefined && !over[i]);
  const outputs = (): TransferOutput[] => rows.map((r, i) => ({ type: r.type, token: r.token, to: r.to.trim(), amount: parsed[i]!.value!.toString() }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run('Sending (confirm in MetaMask)', async () => {
      const r = await invoke<{ txId: string; fee: string }>('midnight_transfer', { outputs: outputs() });
      update([emptyRow()]);
      await refresh();
      return `Sent. Transaction ${r.txId}`;
    });
  };

  return (
    <section>
      <h2>Send</h2>
      <form onSubmit={submit}>
        {rows.map((r, i) => (
          <SendRow
            key={i}
            row={r}
            index={rows.length > 1 ? i + 1 : 0}
            summary={summary}
            contacts={props.contacts.filter((c) => {
              const k = addressKind(c.address);
              return k?.network === props.networkId && k.kind === r.type;
            })}
            error={parsed[i]!.error || (over[i] ? `More than your ${tokenName(r.token)} balance` : '')}
            onChange={(patch) => update(rows.map((x, j) => (j === i ? { ...x, ...patch } : x)))}
            onMax={() => update(rows.map((x, j) => (j === i ? { ...x, amount: formatUnits(balance(x), decimalsOf(x.token)).replace(/,/g, '') } : x)))}
            onRemove={rows.length > 1 ? () => update(rows.filter((_, j) => j !== i)) : undefined}
          />
        ))}
        <div className="row">
          <button type="button" disabled={busy} onClick={() => update([...rows, emptyRow()])}>
            Add another transfer
          </button>
        </div>
        {rows.length > 1 && <p className="muted small">All transfers go in one transaction, with one fee.</p>}
        {rows.some((r) => r.type === 'shielded') && proving === 'browser' && (
          <p className="muted small">A shielded transfer proved in MetaMask takes about 2 minutes, near the 3 minute limit. A proof server is faster.</p>
        )}
        <p className="muted small">
          {fee === null ? 'Fee: not estimated' : `Fee: at most ${formatUnits(fee, DUST_DECIMALS)} DUST. The paid fee is usually much lower: Activity shows it.`}
        </p>
        <div className="row">
          <button
            type="button"
            disabled={busy || !valid}
            onClick={() =>
              run('Estimating the fee', async () => {
                setFee((await invoke<{ fee: string }>('midnight_estimateFee', { outputs: outputs() })).fee);
              })
            }
          >
            Estimate fee
          </button>
          <button className="primary" disabled={busy || !valid}>
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

function SendRow(props: {
  row: Row;
  index: number;
  summary: Summary | null;
  contacts: Contact[];
  error: string;
  onChange: (patch: Partial<Row>) => void;
  onMax: () => void;
  onRemove?: () => void;
}) {
  const { row, summary } = props;
  const [resolved, setResolved] = useState<{ to: string; text: string; error: boolean } | null>(null);
  // NIGHT, and the other tokens of this kind that the wallet has.
  const tokens = [...new Set([NATIVE, ...Object.keys(summary?.tokens?.[row.type] ?? {})])];

  // Show the address of a name before the user sends. The snap resolves it again when it sends.
  useEffect(() => {
    const to = row.to.trim().toLowerCase();
    if (!isName(to)) return setResolved(null);
    const t = setTimeout(() => {
      invoke<{ unshielded?: string; shielded?: string }>('midnight_resolveName', { name: to }).then(
        (r) => {
          const address = row.type === 'shielded' ? r.shielded : r.unshielded;
          setResolved({ to, text: address ?? `${to} has no ${row.type} address`, error: !address });
        },
        (e) => setResolved({ to, text: message(e), error: true }),
      );
    }, 400);
    return () => clearTimeout(t);
  }, [row.to, row.type]);

  return (
    <fieldset>
      {props.index > 0 && <legend>Transfer {props.index}</legend>}
      <div className="row">
        {(['unshielded', 'shielded'] as const).map((t) => (
          <label key={t} className="radio">
            <input type="radio" checked={row.type === t} onChange={() => props.onChange({ type: t, token: NATIVE })} /> {t}
          </label>
        ))}
        {props.onRemove && (
          <button type="button" className="link" onClick={props.onRemove}>
            Remove
          </button>
        )}
      </div>
      <label>
        Token
        <select value={row.token} onChange={(e) => props.onChange({ token: e.target.value, amount: '' })}>
          {tokens.map((t) => (
            <option key={t} value={t}>
              {tokenName(t)} · balance {formatUnits(summary?.tokens?.[row.type][t] ?? '0', decimalsOf(t))}
            </option>
          ))}
        </select>
      </label>
      <label>
        To
        <input
          required
          value={row.to}
          onChange={(e) => props.onChange({ to: e.target.value })}
          placeholder={row.type === 'shielded' ? 'mn_shield-addr_… or a name such as alice.night' : 'mn_addr_… or a name such as alice.night'}
        />
      </label>
      {props.contacts.length > 0 && (
        <select aria-label="Address book" value="" onChange={(e) => e.target.value && props.onChange({ to: e.target.value })}>
          <option value="">From the address book…</option>
          {props.contacts.map((c) => (
            <option key={c.address} value={c.address}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      {resolved && resolved.to === row.to.trim().toLowerCase() && <p className={`small mono ${resolved.error ? 'error' : 'muted'}`}>{resolved.text}</p>}
      <label>
        Amount{decimalsOf(row.token) ? ` (${tokenName(row.token)})` : ` (units of ${tokenName(row.token)})`}
        <span className="row nowrap">
          <input required inputMode="decimal" value={row.amount} onChange={(e) => props.onChange({ amount: e.target.value })} />
          <button type="button" onClick={props.onMax}>
            Max
          </button>
        </span>
      </label>
      {props.error && <p className="small error">{props.error}</p>}
    </fieldset>
  );
}

function Dust({ busy, summary, run, refresh }: { busy: boolean; summary: Summary | null; run: Run; refresh: () => Promise<void> }) {
  const d = summary?.dustDetail;
  if (!d) return null;
  const registered = d.night.filter((n) => n.registered);
  const unregistered = d.night.filter((n) => !n.registered);
  const total = (list: typeof d.night) => formatUnits(list.reduce((a, n) => a + BigInt(n.value), 0n), NIGHT_DECIMALS);
  const percent = BigInt(d.maxCap) > 0n ? Number((10_000n * BigInt(d.generatedNow)) / BigInt(d.maxCap)) / 100 : 0;
  const growing = d.coins.filter((c) => !c.decaying);
  const fullAt = growing.length ? new Date(Math.max(...growing.map((c) => Date.parse(c.maxCapReachedAt)))) : null;

  return (
    <section>
      <h2>DUST</h2>
      <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="DUST generated">
        <span style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <div className="item">
        <span>Generated</span>
        <span className="mono">
          {formatUnits(d.generatedNow, DUST_DECIMALS, 4)} of {formatUnits(d.maxCap, DUST_DECIMALS, 4)} ({percent}%)
        </span>
      </div>
      {fullAt && percent < 100 && fullAt.getTime() > Date.now() && (
        <div className="item">
          <span>Full at</span>
          <span>{fullAt.toLocaleString()}</span>
        </div>
      )}
      <div className="item">
        <span>NIGHT generating DUST</span>
        <span className="mono">
          {total(registered)} ({registered.length} UTXOs)
        </span>
      </div>
      <div className="item">
        <span>NIGHT not registered</span>
        <span className="mono">
          {total(unregistered)} ({unregistered.length} UTXOs)
        </span>
      </div>
      {d.coins.length > 0 && (
        <details>
          <summary className="small">DUST coins ({d.coins.length})</summary>
          {d.coins.map((c, i) => (
            <div key={i} className="item small">
              <span>{c.decaying ? 'Decaying' : 'Growing'}</span>
              <span className="mono">
                {formatUnits(c.generatedNow, DUST_DECIMALS, 4)} / {formatUnits(c.maxCap, DUST_DECIMALS, 4)}
              </span>
            </div>
          ))}
        </details>
      )}
      <p className="muted small">At the last sync. DUST pays transaction fees. Registered NIGHT generates it up to a maximum. After you stop, it decays.</p>
      <div className="row">
        <button
          disabled={busy || unregistered.length === 0}
          onClick={() =>
            run('Registering NIGHT for DUST (confirm in MetaMask)', async () => {
              const r = await invoke<{ registered: number; txId?: string }>('midnight_registerDust');
              await refresh();
              return r.registered ? `Registered ${r.registered} UTXOs. Transaction ${r.txId}` : 'All NIGHT is already registered.';
            })
          }
        >
          Start generating DUST
        </button>
        <button
          disabled={busy || registered.length === 0}
          onClick={() =>
            run('Stopping DUST generation (confirm in MetaMask)', async () => {
              const r = await invoke<{ deregistered: number; txId?: string }>('midnight_deregisterDust');
              await refresh();
              return r.deregistered ? `Stopped generation for ${r.deregistered} UTXOs. Transaction ${r.txId}` : 'No NIGHT is registered.';
            })
          }
        >
          Stop generating DUST
        </button>
      </div>
    </section>
  );
}

function Activity({ history, busy, more }: { history: History; busy: boolean; more: () => void }) {
  const changes = (e: HistoryEntry) =>
    (['unshielded', 'shielded'] as const).flatMap((kind) =>
      Object.entries(e[kind]).map(([token, v]) => ({
        kind,
        out: v.startsWith('-'),
        text: `${v.startsWith('-') ? '' : '+'}${formatUnits(v, decimalsOf(token))} ${token === NATIVE ? 'NIGHT' : `units of ${tokenName(token)}`}`,
      })),
    );
  return (
    <section>
      <h2>Activity</h2>
      {history.entries.length === 0 && <p className="muted">No transactions yet.</p>}
      {history.entries.map((e) => {
        const c = changes(e);
        const label =
          e.status === 'pending' ? 'Pending' : e.status === 'rejected' ? 'Rejected' : e.status === 'failure' ? 'Failed' : c.some((x) => x.out) ? 'Sent' : c.length ? 'Received' : 'No balance change';
        return (
          <div key={e.hash} className="item">
            <span>
              <strong className={e.status === 'failure' || e.status === 'rejected' ? 'error' : ''}>{label}</strong>
              <span className="muted small"> {e.at ? new Date(e.at).toLocaleString() : ''}</span>
              <br />
              <span className="mono small muted" title={e.hash}>
                {e.hash.slice(0, 16)}…
              </span>
            </span>
            <span className="mono right">
              {c.map((x, i) => (
                <span key={i} className={x.out ? '' : 'in'}>
                  {x.text}
                  {x.kind === 'shielded' ? ' (shielded)' : ''}
                  <br />
                </span>
              ))}
              {e.fee && <span className="muted small">fee {formatUnits(e.fee, DUST_DECIMALS)} DUST</span>}
            </span>
          </div>
        );
      })}
      {history.entries.length < history.total && (
        <button disabled={busy} onClick={more}>
          More
        </button>
      )}
    </section>
  );
}

function Settings({ busy, options, run, refresh }: { busy: boolean; options: SyncOptions; run: Run; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(options);
  useEffect(() => setDraft(options), [options]);

  const save = (e: FormEvent) => {
    e.preventDefault();
    run('Saving settings', async () => {
      // Send only the changes: the snap stores each key it gets, and a stored default stays after the default changes.
      // A change to the proving settings asks the user in MetaMask.
      const patch = Object.fromEntries(Object.entries(draft).filter(([k, v]) => v !== options[k as keyof SyncOptions]));
      if (!Object.keys(patch).length) return 'Nothing changed.';
      await invoke('midnight_setSyncOptions', patch);
      await refresh();
      return 'Settings saved.';
    });
  };

  return (
    <section>
      <h2>Settings</h2>
      <form onSubmit={save}>
        <label className="radio">
          <input type="checkbox" checked={draft.shieldedFast} onChange={(e) => setDraft({ ...draft, shieldedFast: e.target.checked })} /> Fast shielded sync
          (the indexer receives your viewing key)
        </label>
        <div className="row">
          {(['browser', 'server'] as const).map((s) => (
            <label key={s} className="radio">
              <input type="radio" name="proving" checked={draft.provingStrategy === s} onChange={() => setDraft({ ...draft, provingStrategy: s })} />{' '}
              {s === 'browser' ? 'Prove in MetaMask' : 'Proof server'}
            </label>
          ))}
        </div>
        {draft.provingStrategy === 'server' && (
          <label>
            Proof server
            <input type="url" value={draft.provingServerUrl} onChange={(e) => setDraft({ ...draft, provingServerUrl: e.target.value })} />
          </label>
        )}
        <button disabled={busy}>Save</button>
      </form>
    </section>
  );
}

function NetworkSettings({ busy, network, run, refresh }: { busy: boolean; network: Network; run: Run; refresh: () => Promise<void> }) {
  const { endpoints } = network;
  const [indexer, setIndexer] = useState(endpoints.indexerHttpUrl);
  const [node, setNode] = useState(endpoints.nodeWsUrl);
  useEffect(() => {
    setIndexer(endpoints.indexerHttpUrl);
    setNode(endpoints.nodeWsUrl);
  }, [endpoints.indexerHttpUrl, endpoints.nodeWsUrl]);

  const save = (indexerHttpUrl: string, nodeWsUrl: string) =>
    run('Saving endpoints (confirm in MetaMask)', async () => {
      const r = await invoke<{ changed: boolean }>('midnight_setEndpoints', { indexerHttpUrl, nodeWsUrl });
      await refresh();
      return r.changed ? 'Endpoints saved. The next sync uses them.' : 'Nothing changed.';
    });

  return (
    <section>
      <h2>Endpoints ({network.networkId})</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(indexer, node);
        }}
      >
        <label>
          Indexer
          <input type="url" required value={indexer} onChange={(e) => setIndexer(e.target.value)} />
        </label>
        <label>
          Node
          <input required value={node} onChange={(e) => setNode(e.target.value)} />
        </label>
        <p className="muted small">The indexer sees your addresses. With fast shielded sync it also sees your shielded history.</p>
        <div className="row">
          <button disabled={busy}>Save</button>
          <button type="button" disabled={busy || !endpoints.custom} onClick={() => save('', '')}>
            Use defaults
          </button>
        </div>
      </form>
    </section>
  );
}
