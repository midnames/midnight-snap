import { installSnap } from '@metamask/snaps-jest';
import { execFileSync } from 'node:child_process';

/** A local development page: the only kind of origin the non-connector RPC answers. */
const LOCAL = 'http://localhost:8095';

/** ledger-v9's verifySignature, run in a child Node process: the package is ESM + wasm, which jest's
 *  CJS transform cannot load. `data` is hex. */
const verify = (verifyingKey: string, signature: string, data: string) =>
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `const l = await import('@midnightntwrk/ledger-v9');
       const [vk, sig, data] = JSON.parse(process.argv[1]);
       process.stdout.write(String(l.verifySignature({ tag: 'schnorr', value: vk }, Buffer.from(data, 'hex'), { tag: 'schnorr', value: sig })));`,
      JSON.stringify([verifyingKey, signature, data]),
    ],
    { cwd: __dirname, encoding: 'utf8' },
  ) === 'true';

// Known answers: wallet-sdk-hd from the snaps-jest SRP 'test test ... ball' on network "stagenet"
// (reference script: HDWallet.fromSeed(mnemonicToSeed(SRP)) -> m/44'/2400'/0'/role/0).
describe('midnight snap', () => {
  it('derives addresses via ledger-v9 wasm, matching wallet-sdk-hd', async () => {
    const { request } = await installSnap();
    const res = await request({ origin: LOCAL, method: 'midnight_getAccounts' });
    expect(res).toRespondWith(expect.objectContaining({
      shielded: 'mn_shield-addr_stagenet14a9yq2z5tecqpl0zpu498k4zx323wqshvrwdh7zecyd00kesngrh0rdgz8248fjh9anhfex68l9kea4l96e544n2gzx738paurjyl9caq2ex2',
      unshielded: 'mn_addr_stagenet1em2hy0f0qafqp2fwmhtf5jfhre0zauu88xpw84vpj0tetsml6ujsxlugru',
    }));
  });

  it('signs with the unshielded (schnorr) key after confirmation', async () => {
    const { request } = await installSnap();
    const res = request({ origin: LOCAL, method: 'midnight_signData', params: { hex: 'deadbeef' } });
    const ui = await res.getInterface();
    await (ui as any).ok();
    expect(await res).toRespondWith(expect.objectContaining({
      signature: expect.objectContaining({ tag: 'schnorr' }),
      verifyingKey: expect.objectContaining({ tag: 'schnorr' }),
    }));
  });

  it('keeps every method but the connector to local development pages', async () => {
    const { request } = await installSnap();
    for (const method of ['midnight_getAccounts', 'midnight_reset', 'midnight_getSites', 'midnight_trace', 'midnight_setSyncOptions', 'ping']) {
      expect(await request({ origin: 'https://evil.example', method })).toRespondWithError(
        expect.objectContaining({ message: expect.stringContaining('only available to local development pages') }),
      );
    }
    // Look-alike hosts are not local.
    expect(await request({ origin: 'http://localhost.evil.example', method: 'midnight_getNetwork' })).toRespondWithError(
      expect.objectContaining({ message: expect.stringContaining('only available to local development pages') }),
    );
    for (const origin of ['http://localhost:3000', 'http://127.0.0.1:8095', 'http://[::1]:5173']) {
      expect(await request({ origin, method: 'midnight_getNetwork' })).toRespondWith(expect.objectContaining({ networkId: 'stagenet' }));
    }
    // Any site keeps the connector, which has its own per-origin grants.
    const status = await request({ origin: 'https://evil.example', method: 'midnight_connector', params: { method: 'getConnectionStatus', args: '[]' } });
    expect((status as any).response.result).toEqual({ ok: true, result: JSON.stringify({ status: 'disconnected' }) });
  });

  it('asks before a reset', async () => {
    const { request } = await installSnap();
    const res = request({ origin: LOCAL, method: 'midnight_reset' });
    await ((await res.getInterface()) as any).cancel();
    expect(await res).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('rejected') }));
  });

  it('rejects a recipient from another network before touching the network', async () => {
    const { request } = await installSnap();
    const res = await request({ origin: LOCAL, method: 'midnight_transfer', params: { type: 'unshielded', to: 'mn_addr_undeployed1em2hy0f0qafqp2fwmhtf5jfhre0zauu88xpw84vpj0tetsml6ujstthdyg', amount: '1' } });
    expect(res).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('network') }));
  });

  it('background cronjob is a no-op before the first sync and leaves a trace', async () => {
    const { onCronjob, request } = await installSnap();
    const res = await onCronjob({ method: 'backgroundSync' });
    expect(res).toRespondWith(null);
    const tr = await request({ origin: LOCAL, method: 'midnight_trace' });
    expect(tr).toRespondWith(expect.arrayContaining([expect.stringContaining('cron sync skipped')]));
  });

  it('home page renders from empty state without touching the network', async () => {
    const { onHomePage } = await installSnap();
    const res = await onHomePage();
    const ui = await res.getInterface();
    const text = JSON.stringify(ui.content);
    expect(text).toContain('Midnight (stagenet)');
    expect(text).toContain('Not synced yet');
    expect(text).toContain('mn_addr_stagenet1em2hy0f0qafqp2fwmhtf5jfhre0zauu88xpw84vpj0tetsml6ujsxlugru');
    expect(text).toContain('Sync now');
    expect(text).toContain('Send');
  });
});

describe('network', () => {
  const enc = (v: unknown) => JSON.stringify(v);

  it('switches at runtime and keeps state, addresses and grants per network', async () => {
    const { request, onHomePage } = await installSnap();
    expect(await request({ origin: LOCAL, method: 'midnight_getNetwork' })).toRespondWith({
      networkId: 'stagenet',
      available: ['stagenet', 'undeployed'],
    });

    // Connect a dApp on stagenet; the grant must not carry over to another network.
    const conn = request({ method: 'midnight_connector', params: { method: 'connect', args: enc(['stagenet']) } });
    await ((await conn.getInterface()) as any).ok();
    await conn;
    expect(await request({ origin: LOCAL, method: 'midnight_getSites' })).toRespondWith([expect.stringContaining('http')]);

    const sw = request({ origin: LOCAL, method: 'midnight_setNetwork', params: { networkId: 'undeployed' } });
    await ((await sw.getInterface()) as any).ok();
    expect(await sw).toRespondWith({ networkId: 'undeployed', changed: true });

    expect(await request({ origin: LOCAL, method: 'midnight_getSites' })).toRespondWith([]);
    const accounts = (await request({ origin: LOCAL, method: 'midnight_getAccounts' })) as any;
    expect(accounts.response.result.unshielded).toContain('mn_addr_undeployed1');

    const status = await request({ method: 'midnight_connector', params: { method: 'getConnectionStatus', args: enc([]) } });
    expect(JSON.parse((status as any).response.result.result)).toEqual({ status: 'disconnected' });

    const ui = await (await onHomePage()).getInterface();
    expect(JSON.stringify(ui.content)).toContain('Midnight (undeployed)');

    // A dApp still asking for stagenet is refused rather than silently served the wrong chain.
    const stale = await request({ method: 'midnight_connector', params: { method: 'connect', args: enc(['stagenet']) } });
    expect((stale as any).response.result.error.reason).toContain('undeployed');
  });

  it('rejects an unknown network and a declined switch', async () => {
    const { request } = await installSnap();
    // Refused before any dialog. `toString` is on every object's prototype, not a network.
    for (const networkId of ['other', 'toString']) {
      const bad = await request({ origin: LOCAL, method: 'midnight_setNetwork', params: { networkId } });
      expect(bad).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('unknown network') }));
    }

    const declined = request({ origin: LOCAL, method: 'midnight_setNetwork', params: { networkId: 'undeployed' } });
    await ((await declined.getInterface()) as any).cancel();
    expect(await declined).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('rejected') }));
    expect(await request({ origin: LOCAL, method: 'midnight_getNetwork' })).toRespondWith(expect.objectContaining({ networkId: 'stagenet' }));
  });
});

describe('proving settings', () => {
  it('defaults to in-browser proving, with a localhost:6300 proof server prefilled', async () => {
    const { request, onHomePage } = await installSnap();
    expect(await request({ origin: LOCAL, method: 'midnight_getSyncOptions' })).toRespondWith(
      expect.objectContaining({ provingStrategy: 'browser', provingServerUrl: 'http://localhost:6300', provingParamsUrl: 'https://assets.midnames.com' }),
    );
    const text = JSON.stringify((await (await onHomePage()).getInterface()).content);
    expect(text).toContain('http://localhost:6300');
    expect(text).toContain('Save proving settings');
  });

  it('asks before a dApp redirects proving, and rejects a malformed URL first', async () => {
    const { request } = await installSnap();
    const bad = await request({ origin: LOCAL, method: 'midnight_setSyncOptions', params: { provingServerUrl: 'not a url' } });
    expect(bad).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('not a URL') }));

    const declined = request({ origin: LOCAL, method: 'midnight_setSyncOptions', params: { provingStrategy: 'server', provingServerUrl: 'https://prover.example' } });
    await ((await declined.getInterface()) as any).cancel();
    expect(await declined).toRespondWithError(expect.objectContaining({ message: expect.stringContaining('rejected') }));
    expect(await request({ origin: LOCAL, method: 'midnight_getSyncOptions' })).toRespondWith(expect.objectContaining({ provingStrategy: 'browser' }));

    const approved = request({ origin: LOCAL, method: 'midnight_setSyncOptions', params: { provingStrategy: 'server', provingServerUrl: 'https://prover.example/' } });
    await ((await approved.getInterface()) as any).ok();
    expect(await approved).toRespondWith(expect.objectContaining({ provingStrategy: 'server', provingServerUrl: 'https://prover.example' }));

    // dApps see the server only once the user proves with one.
    const conn = request({ method: 'midnight_connector', params: { method: 'connect', args: JSON.stringify(['stagenet']) } });
    await ((await conn.getInterface()) as any).ok();
    await conn;
    const cfg = await request({ method: 'midnight_connector', params: { method: 'getConfiguration', args: JSON.stringify([]) } });
    expect(JSON.parse((cfg as any).response.result.result)).toMatchObject({ proverServerUri: 'https://prover.example' });
  });

  it("cannot switch the network past setNetwork's confirmation", async () => {
    const { request } = await installSnap();
    // No proving field changes, so no dialog: the networkId key must simply be dropped.
    const res = await request({ origin: LOCAL, method: 'midnight_setSyncOptions', params: { networkId: 'undeployed', shieldedFast: true } });
    expect(res).toRespondWith(expect.not.objectContaining({ networkId: expect.anything() }));
    expect(await request({ origin: LOCAL, method: 'midnight_getNetwork' })).toRespondWith(expect.objectContaining({ networkId: 'stagenet' }));
  });
});

// Every connector reply is a {ok, result | error} envelope so the dapp-connector error
// code survives MetaMask's RPC boundary; connector/src/index.ts turns it back into an APIError.
describe('connector', () => {
  const enc = (v: unknown) => JSON.stringify(v);
  const connector = (method: string, args: unknown[] = []) => ({ method: 'midnight_connector', params: { method, args: enc(args) } });
  const envelope = (res: unknown) => (res as any).response.result;

  it('refuses before connect, then serves configuration and addresses', async () => {
    const { request } = await installSnap();
    for (const method of ['getUnshieldedAddress', 'getConfiguration']) {
      const before = await request(connector(method));
      expect(envelope(before)).toEqual({ ok: false, error: { code: 'PermissionRejected', reason: expect.stringContaining('not connected') } });
    }

    const wrongNet = await request(connector('connect', ['undeployed']));
    expect(envelope(wrongNet)).toEqual({ ok: false, error: { code: 'InternalError', reason: expect.stringContaining('wallet is on "stagenet"') } });

    const conn = request(connector('connect', ['stagenet']));
    await ((await conn.getInterface()) as any).ok();
    expect(envelope(await conn)).toEqual({ ok: true, result: 'null' });

    const cfg = await request(connector('getConfiguration'));
    expect(JSON.parse(envelope(cfg).result)).toMatchObject({ networkId: 'stagenet', indexerUri: expect.stringContaining('stagenet') });
    const addr = await request(connector('getUnshieldedAddress'));
    expect(JSON.parse(envelope(addr).result)).toEqual({ unshieldedAddress: 'mn_addr_stagenet1em2hy0f0qafqp2fwmhtf5jfhre0zauu88xpw84vpj0tetsml6ujsxlugru' });
  });

  it('lists and revokes connected sites', async () => {
    const { request } = await installSnap();
    expect(await request({ origin: LOCAL, method: 'midnight_getSites' })).toRespondWith([]);

    const conn = request(connector('connect', ['stagenet']));
    await ((await conn.getInterface()) as any).ok();
    await conn;
    expect(await request({ origin: LOCAL, method: 'midnight_getSites' })).toRespondWith([expect.stringContaining('http')]);

    const sites = (await request({ origin: LOCAL, method: 'midnight_getSites' })) as any;
    const origin = sites.response.result[0];
    expect(await request({ origin: LOCAL, method: 'midnight_revokeSite', params: { origin } })).toRespondWith({ revoked: true });
    expect(await request({ origin: LOCAL, method: 'midnight_revokeSite', params: { origin } })).toRespondWith({ revoked: false });
    expect(await request({ origin: LOCAL, method: 'midnight_getSites' })).toRespondWith([]);

    // A revoked site is back to square one, not silently still authorized.
    const after = await request(connector('getUnshieldedAddress'));
    expect(envelope(after).error.code).toBe('PermissionRejected');
  });

  it('signs the spec-prefixed message, never the raw bytes', async () => {
    const { request } = await installSnap();
    const conn = request(connector('connect', ['stagenet']));
    await ((await conn.getInterface()) as any).ok();
    await conn;

    const prefixed = Buffer.concat([Buffer.from('midnight_signed_message:4:'), Buffer.from('deadbeef', 'hex')]).toString('hex');

    const res = request(connector('signData', ['deadbeef', { encoding: 'hex', keyType: 'unshielded' }]));
    await ((await res.getInterface()) as any).ok();
    const { data, signature, verifyingKey } = JSON.parse(envelope(await res).result);
    expect(data).toBe('deadbeef');
    expect(verify(verifyingKey, signature, prefixed)).toBe(true);
    expect(verify(verifyingKey, signature, 'deadbeef')).toBe(false);

    // The raw RPC must not be a way around the prefix either.
    const raw = request({ origin: LOCAL, method: 'midnight_signData', params: { hex: 'deadbeef' } });
    await ((await raw.getInterface()) as any).ok();
    const r = ((await raw) as any).response.result;
    expect(verify(r.verifyingKey.value, r.signature.value, prefixed)).toBe(true);
    expect(verify(r.verifyingKey.value, r.signature.value, 'deadbeef')).toBe(false);

    // Malformed data is refused before any dialog, instead of signing a truncated prefix of it.
    const bad = await request(connector('signData', ['deadbeefzz', { encoding: 'hex', keyType: 'unshielded' }]));
    expect(envelope(bad).error).toEqual({ code: 'InvalidRequest', reason: 'data is not valid hex' });
    const badB64 = await request(connector('signData', ['3q2+7w!!', { encoding: 'base64', keyType: 'unshielded' }]));
    expect(envelope(badB64).error).toEqual({ code: 'InvalidRequest', reason: 'data is not valid base64' });
  });

  it('maps a declined confirmation to Rejected, not InternalError', async () => {
    const { request } = await installSnap();
    const conn = request(connector('connect', ['stagenet']));
    await ((await conn.getInterface()) as any).cancel();
    expect(envelope(await conn)).toEqual({ ok: false, error: { code: 'Rejected', reason: 'user rejected' } });
  });

  it('serves the 4.0.1 balance method names, not the facade ones', async () => {
    const { request } = await installSnap();
    const conn = request(connector('connect', ['stagenet']));
    await ((await conn.getInterface()) as any).ok();
    await conn;

    const old = await request(connector('balanceUnboundTransaction', ['00']));
    expect(envelope(old)).toEqual({ ok: false, error: { code: 'InvalidRequest', reason: expect.stringContaining('not supported') } });
    // Reaches the handler (and fails deserializing '00'), rather than being unknown.
    const spec = await request(connector('balanceUnsealedTransaction', ['00']));
    expect(envelope(spec).error.code).not.toBe('InvalidRequest');
  });
});
