// The wallet site of the Midnight Snap. It calls the snap's wallet methods with wallet_invokeSnap. A production
// snap answers them only for its SNAP_WALLET_ORIGIN, a development snap also for localhost (README, "Wallet site").
import { useEffect, useRef, useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import { Icon } from './Icon';
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
  const tab = useTab();
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
        <section className="connect">
          <div className="hero-head">
            <span className="hero-mark">M</span>
            <span className="hero-title">
              <strong>Midnight Snap</strong>
              <small>Midnight wallet in MetaMask</small>
            </span>
          </div>
          <h1>Connect MetaMask</h1>
          <p className="muted">A Midnight wallet in MetaMask. Your keys stay in MetaMask; this page only asks the snap.</p>
          <div className="row">
            <span className="pill tag shielded">
              <Icon name="lock" className="icon-sm" />
              Shielded
            </span>
            <span className="pill tag">
              <Icon name="globe" className="icon-sm" />
              Unshielded
            </span>
            <span className="pill tag">
              <Icon name="dust" className="icon-sm" />
              DUST
            </span>
          </div>
          <button className="primary full" disabled={!!busy} onClick={connect}>
            {busy ? <span className="spinner" /> : <Icon name="wallet" className="icon" />}
            {busy ? `${busy.label}…` : 'Connect MetaMask'}
          </button>
          {notice && <p className={`alert ${notice.error ? 'error' : ''}`}>{notice.text}</p>}
          <p className="snap-id muted small mono">
            {SNAP_ID}
          </p>
        </section>
      </main>
    );
  }

  const { summary, accounts, network } = wallet;
  const tokens = summary?.tokens;
  // A summary from an older snap has only the sum of all tokens of each kind.
  const night = BigInt(tokens ? (tokens.unshielded[NATIVE] ?? '0') : (summary?.unshielded ?? '0'));
  const shieldedNight = BigInt(tokens ? (tokens.shielded[NATIVE] ?? '0') : (summary?.shielded ?? '0'));
  const sync = busy
    ? { dot: 'warn', text: busy.label }
    : !summary
      ? { dot: '', text: 'Not synced' }
      : summary.synced
        ? { dot: 'ok', text: `Synced ${ago(summary.at)}` }
        : { dot: 'warn', text: 'Sync incomplete' };
  const more = () =>
    run('Loading activity', async () => {
      const next = await invoke<History>('midnight_getHistory', { page: history.entries.length / PAGE, pageSize: PAGE });
      setHistory({ total: next.total, entries: [...history.entries, ...next.entries] });
    });
  // Every tab stays mounted and only the active one shows, so a half-filled form survives a tab change.
  const panel = (id: Tab) => ({ hidden: tab !== id, 'aria-labelledby': `tab-${id}` });
  return (
    <main>
      <header className="topbar">
        <span className="hero-mark" aria-hidden="true">
          M
        </span>
        <span className="hero-title">
          <strong>Midnight Snap</strong>
          <small>
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
              </select>{' '}
              · MetaMask
          </small>
        </span>
        <span className="pill" role="status">
          <span className={`dot ${sync.dot}`} />
          <span>{sync.text}</span>
        </span>
        <button className="icon-button" title="Sync" aria-label="Sync" disabled={!!busy} onClick={() => run('Syncing', syncNow)}>
          <Icon name="refresh" className="icon" />
        </button>
      </header>

      <Status busy={busy} notice={notice} dismiss={() => setNotice(null)} />

      <div className="panel" {...panel('wallet')}>
        <div className="hero">
          <div className="hero-total">
            <div className="amount">{formatUnits(night + shieldedNight, NIGHT_DECIMALS)} NIGHT</div>
            <p>Private and public balances together.</p>
          </div>
          <div className="balances">
            <Balance label="Unshielded" value={formatUnits(night, NIGHT_DECIMALS)} />
            <Balance label="Shielded" value={formatUnits(shieldedNight, NIGHT_DECIMALS)} />
            <Balance label="DUST" value={formatUnits(summary?.dust ?? '0', DUST_DECIMALS, 4)} />
          </div>
          <div className="hero-actions">
            <a className="hero-action" href="#receive">
              <Icon name="receive" className="icon" />
              Receive
            </a>
            <a className="hero-action" href="#send">
              <Icon name="send" className="icon" />
              Send
            </a>
          </div>
        </div>
        <div className="cols">
          <div className="col">
            {tokens && (
              <section>
                <h2>Assets</h2>
                {(['unshielded', 'shielded'] as const).flatMap((kind) =>
                  Object.entries(tokens[kind]).map(([type, amount]) => (
                    <div key={kind + type} className="item asset" title={type}>
                      <span className="asset-icon" aria-hidden="true">
                        {tokenName(type).slice(0, 1).toUpperCase()}
                      </span>
                      <span className="asset-name">
                        {type === NATIVE ? <strong>NIGHT</strong> : <TokenName token={type} names={names} setNames={setNames} />}
                        <KindTag kind={kind} />
                      </span>
                      <span className="asset-amount">{formatUnits(amount, decimalsOf(type))}</span>
                    </div>
                  )),
                )}
                {!Object.keys(tokens.unshielded).length && !Object.keys(tokens.shielded).length && (
                  <p className="muted small">No token balances yet. Use Receive to share a shielded or unshielded address.</p>
                )}
              </section>
            )}
            <Activity history={history} busy={!!busy} more={more} recent />
          </div>
          <div className="col">
            <Dust busy={!!busy} summary={summary} run={run} refresh={refresh} />
          </div>
        </div>
      </div>

      <div className="panel" {...panel('receive')}>
        <h1 className="page-title">Receive</h1>
        <div className="receive-grid">
          <Copy label="Unshielded address" value={accounts.unshielded} qr />
          <Copy label="Shielded address" value={accounts.shielded} qr />
          <Copy label="DUST public key" value={accounts.dustPublicKey} qr />
        </div>
      </div>

      <div className="panel" {...panel('send')}>
        <h1 className="page-title">Send</h1>
        <div className="cols">
          <Send busy={!!busy} contacts={contacts} networkId={network.networkId} summary={summary} proving={wallet.options.provingStrategy} run={run} refresh={refresh} />
          <AddressBook contacts={contacts} setContacts={setContacts} networkId={network.networkId} />
        </div>
      </div>

      <div className="panel" {...panel('activity')}>
        <h1 className="page-title">Activity</h1>
        <Activity history={history} busy={!!busy} more={more} />
      </div>

      <div className="panel" {...panel('settings')}>
        <h1 className="page-title">Settings</h1>
        <div className="settings-grid">
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
          <h2>Appearance</h2>
          <div className="segmented">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <label key={t}>
                <input
                  type="radio"
                  name="theme"
                  checked={theme === t}
                  onChange={() => {
                    setTheme(t);
                    applyTheme(t);
                  }}
                />
                {{ system: 'System', light: 'Light', dark: 'Dark' }[t]}
              </label>
            ))}
          </div>
        </section>

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
        </div>
      </div>

      <Nav active={tab} />
    </main>
  );
}

const NAV = [
  { id: 'wallet', label: 'Wallet', icon: 'wallet' },
  { id: 'receive', label: 'Receive', icon: 'receive' },
  { id: 'send', label: 'Send', icon: 'send' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const;

type Tab = (typeof NAV)[number]['id'];
const tabOf = (hash: string): Tab => NAV.find((n) => `#${n.id}` === hash)?.id ?? 'wallet';

/** The tab in the URL hash, so links, back and reload keep it. */
function useTab() {
  const [tab, setTab] = useState(() => tabOf(location.hash));
  useEffect(() => {
    const onHash = () => (setTab(tabOf(location.hash)), scrollTo(0, 0));
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  return tab;
}

/** The extension's bottom bar, a sidebar on wide screens. */
function Nav({ active }: { active: Tab }) {
  return (
    <nav className="nav" aria-label="Wallet">
      <div className="nav-inner">
        {NAV.map((n) => (
          <a
            key={n.id}
            id={`tab-${n.id}`}
            href={`#${n.id}`}
            aria-current={active === n.id ? 'page' : undefined}
            className={`${n.id === 'send' ? 'prominent' : ''} ${active === n.id ? 'active' : ''}`}
          >
            <span>
              <Icon name={n.icon} className={n.id === 'send' ? 'icon' : 'icon-sm'} />
            </span>
            {n.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/** Shielded or unshielded, as a tag. */
function KindTag({ kind }: { kind: Kind }) {
  return (
    <span className={`pill tag ${kind === 'shielded' ? 'shielded' : ''}`}>
      <Icon name={kind === 'shielded' ? 'lock' : 'globe'} className="icon-sm" />
      {kind}
    </span>
  );
}

/** The busy operation with its sync progress, or the last result, above the bottom bar. */
function Status({ busy, notice, dismiss }: { busy: { label: string; since: number } | null; notice: { error: boolean; text: string } | null; dismiss: () => void }) {
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

  // The hero's pill shows the last sync. The toast shows only a result, until the user dismisses it.
  if (!busy) {
    if (!notice) return null;
    return (
      <div className={`alert toast ${notice.error ? 'error' : 'ok'}`} role={notice.error ? 'alert' : 'status'}>
        <span>{notice.text}</span>
        <button type="button" aria-label="Dismiss notification" onClick={dismiss}>
          Dismiss
        </button>
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
    <div className="alert toast" role="status">
      <span className="spinner" />
      <span>
        {busy.label}… {Math.round((Date.now() - busy.since) / 1000)} s{detail}
      </span>
    </div>
  );
}

function Balance({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="kicker">{label}</span>
      <span className="amount">{value}</span>
    </div>
  );
}

function Copy({ label, value, qr }: { label: string; value: string; qr?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    if (qr) QRCode.toDataURL(value, { margin: 0, width: 320 }).then(setImage, () => setImage(null));
  }, [qr, value]);
  return (
    <div className="copy">
      <div className="copy-head">
        <span className="kicker">{label}</span>
        <button
          type="button"
          className="small"
          onClick={() => navigator.clipboard.writeText(value).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1500)))}
        >
          <Icon name={copied ? 'check' : 'copy'} className="icon-sm" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="copy-value mono">{value}</div>
      {image && <img className="qr" src={image} alt={`QR code of the ${label.toLowerCase()}`} />}
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
            <Icon name="send" className="icon-sm" />
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
      <div className="row nowrap">
        <div className="segmented grow">
          {(['unshielded', 'shielded'] as const).map((t) => (
            <label key={t}>
              <input type="radio" checked={row.type === t} onChange={() => props.onChange({ type: t, token: NATIVE })} />
              {t === 'shielded' ? 'Shielded' : 'Unshielded'}
            </label>
          ))}
        </div>
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

/** The activity. `recent` shows the last three, with a link to the Activity tab. */
function Activity({ history, busy, more, recent }: { history: History; busy: boolean; more: () => void; recent?: boolean }) {
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
      {recent && (
        <div className="section-head">
          <h2>Recent activity</h2>
          <a className="link" href="#activity">
            View all
          </a>
        </div>
      )}
      {history.entries.length === 0 && <p className="muted">No transactions yet.</p>}
      {(recent ? history.entries.slice(0, 3) : history.entries).map((e) => {
        const c = changes(e);
        const sent = c.some((x) => x.out);
        const bad = e.status === 'failure' || e.status === 'rejected';
        const label =
          e.status === 'pending' ? 'Pending' : e.status === 'rejected' ? 'Rejected' : e.status === 'failure' ? 'Failed' : sent ? 'Sent' : c.length ? 'Received' : 'No balance change';
        return (
          <div key={e.hash} className="item">
            <span className={`entry-icon ${bad ? 'bad' : sent ? '' : c.length ? 'in' : ''}`} aria-hidden="true">
              <Icon name={bad ? 'warning' : e.status === 'pending' ? 'activity' : sent ? 'send' : 'receive'} className="icon-sm" />
            </span>
            <span className="grow">
              <strong className={bad ? 'error' : ''}>{label}</strong>
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
      {!recent && history.entries.length < history.total && (
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
        <label className="check">
          <input type="checkbox" checked={draft.shieldedFast} onChange={(e) => setDraft({ ...draft, shieldedFast: e.target.checked })} /> Fast shielded sync
          (the indexer receives your viewing key)
        </label>
        <div className="segmented">
          {(['browser', 'server'] as const).map((s) => (
            <label key={s}>
              <input type="radio" name="proving" checked={draft.provingStrategy === s} onChange={() => setDraft({ ...draft, provingStrategy: s })} />
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
