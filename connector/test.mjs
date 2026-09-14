// node --test test.mjs  (run `pnpm build` first)
// Covers the parts that are not a straight pass-through: provider discovery,
// the bigint-JSON wire format, and turning the snap's envelope into an APIError.
import assert from 'node:assert/strict';
import test from 'node:test';

// --- browser stubs, installed before the module under test is imported -------
const win = new EventTarget();
globalThis.window = win;

/** Swapped per test; `wallet_requestSnaps` always succeeds unless overridden. */
let handle = async () => null;
const metamask = { request: (args) => handle(args) };

// A different wallet holding window.ethereum, as Phantom/Rabby/Coinbase do.
win.ethereum = { request: async () => assert.fail('called the wrong provider'), isMetaMask: false };
win.addEventListener('eip6963:requestProvider', () => {
  win.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: { info: { rdns: 'io.metamask.flask' }, provider: metamask },
    }),
  );
});

const { registerMidnightSnap } = await import('./dist/index.js');

const api = registerMidnightSnap({ snapId: 'local:http://localhost:8093' });

/** MetaMask methods seen by the stub, in order. */
let calls = [];

/** Connect with a stub snap (installed unless `installed: false`), replies under our control. */
async function connected(reply, { installed = true } = {}) {
  calls = [];
  handle = async ({ method, params }) => {
    calls.push(method);
    if (method === 'wallet_getSnaps') return installed ? { 'local:http://localhost:8093': { version: '0.9.0' } } : {};
    if (method === 'wallet_requestSnaps') return {};
    assert.equal(method, 'wallet_invokeSnap');
    return reply(params.request.params);
  };
  return api.connect('stagenet');
}

const okConnect = ({ method }) => (method === 'connect' ? { ok: true, result: 'null' } : null);

test('requests the snap only when this origin does not have it installed', async () => {
  // Every wallet_requestSnaps is a MetaMask popup, even for an installed snap.
  await connected(okConnect, { installed: false });
  assert.deepEqual(calls, ['wallet_getSnaps', 'wallet_requestSnaps', 'wallet_invokeSnap']);

  await connected(okConnect, { installed: true });
  assert.deepEqual(calls, ['wallet_getSnaps', 'wallet_invokeSnap']);
});

test('installs per the spec: fresh UUIDv4 key, tamper-proof, one entry per snap id', () => {
  const [key, ...rest] = Object.keys(window.midnight);
  assert.equal(rest.length, 0);
  assert.match(key, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(window.midnight[key], api);
  assert.equal(api.apiVersion, '4.0.1');

  const entry = Object.getOwnPropertyDescriptor(window.midnight, key);
  assert.deepEqual([entry.writable, entry.configurable, entry.enumerable], [false, false, true]);
  const global = Object.getOwnPropertyDescriptor(window, 'midnight');
  assert.deepEqual([global.writable, global.configurable], [false, false]);
  assert.throws(() => { window.midnight = {}; }, TypeError, 'a page script must not be able to replace window.midnight');

  assert.equal(registerMidnightSnap({ snapId: 'local:http://localhost:8093' }), api, 'same snap id: no second listing');
  assert.notEqual(registerMidnightSnap({ snapId: 'npm:@midnames/midnight-snap' }), api, 'another snap id gets its own entry');
  assert.equal(Object.keys(window.midnight).length, 2);
});

test('finds MetaMask over EIP-6963 rather than window.ethereum', async () => {
  // window.ethereum above fails the test if it is ever used.
  const connectedApi = await connected(() => ({ ok: true, result: 'null' }));
  assert.equal(typeof connectedApi.getUnshieldedAddress, 'function');
});

test('round-trips bigints, bytes and undefined through the wire format', async () => {
  let seen;
  const connectedApi = await connected(({ method, args }) => {
    if (method === 'connect') return { ok: true, result: 'null' };
    seen = args; // echo the encoded args back as the result
    return { ok: true, result: args };
  });
  const sent = [1n, new Uint8Array([0, 1, 255]), undefined, { nested: 2n }];
  const got = await connectedApi.makeTransfer(...sent);
  assert.match(seen, /"__t":"bigint"/);
  assert.deepEqual(got, sent);
});

test('turns the snap envelope into a spec APIError', async () => {
  const connectedApi = await connected(({ method }) =>
    method === 'connect'
      ? { ok: true, result: 'null' }
      : { ok: false, error: { code: 'Rejected', reason: 'user rejected' } },
  );
  await assert.rejects(connectedApi.getDustAddress(), (err) => {
    assert.equal(err.type, 'DAppConnectorAPIError');
    assert.equal(err.code, 'Rejected');
    assert.equal(err.reason, 'user rejected');
    return true;
  });
});

test('maps a declined MetaMask prompt (4001) to Rejected', async () => {
  handle = async () => {
    throw Object.assign(new Error('User rejected the request.'), { code: 4001 });
  };
  await assert.rejects(api.connect('stagenet'), (err) => err.code === 'Rejected');
});

test('rejects a reply that is not an envelope (older snap)', async () => {
  const connectedApi = await connected(({ method }) => (method === 'connect' ? { ok: true, result: 'null' } : 'null'));
  await assert.rejects(connectedApi.getDustAddress(), (err) => err.code === 'InternalError');
});
