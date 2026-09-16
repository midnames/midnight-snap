import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// The bindings need the compact-runtime wasm, which jest's CJS transform cannot load. Run them in Node, which strips
// the TypeScript types itself. The fixture is the stagenet MidNS contract state, where snap.night was registered.
const run = (script: string) =>
  JSON.parse(
    execFileSync(process.execPath, ['--input-type=module', '--no-warnings', '-e', script], { cwd: __dirname, encoding: 'utf8' }),
  );

const midns = `
  const { readFileSync } = await import('node:fs');
  const { readMidns } = await import(${JSON.stringify(join(__dirname, 'midns.ts'))});
  const { stateHex, network } = JSON.parse(readFileSync(${JSON.stringify(join(__dirname, 'midns.fixture.json'))}, 'utf8'));
  const ns = readMidns(stateHex, network);
  const attempt = (f) => { try { return f(); } catch (e) { return { error: e.message }; } };
`;

const PAYER = 'f6d0afbbee63cd95c6736baf7986b79249f6225750a15b5dd88b1efe15381b54';

describe('MidNS', () => {
  it('resolves a name to its address and fields, and an address back to its names', () => {
    const r = run(`${midns}
      process.stdout.write(JSON.stringify({
        tld: ns.tld,
        record: ns.resolve('Snap.night '),
        names: ns.namesFor(['${PAYER.toUpperCase()}']),
        none: ns.namesFor(['${'00'.repeat(32)}']),
        unregistered: attempt(() => ns.resolve('nobody.night')),
        otherTld: attempt(() => ns.resolve('snap.eth')),
        tooLong: attempt(() => ns.resolve('${'a'.repeat(33)}.night')),
      }));`);
    expect(r.tld).toBe('night');
    expect(r.record).toEqual({
      name: 'snap.night',
      target: { kind: 'unshielded', hex: PAYER },
      owner: PAYER,
      fields: { did: 'did:midnight:stagenet:f63ba2791972e511dccca154d75df67ed22cdaccb3d01f539fbfbeda0eb07679' },
      unshielded: 'mn_addr_stagenet17mg2lwlwv0xet3nndwhhnp4hjfylvgjh2zs4khwc3v00u9fcrd2qyqxzpn',
    });
    expect(r.names).toEqual(['snap.night']);
    expect(r.none).toEqual([]);
    expect(r.unregistered).toEqual({ error: 'nobody.night is not registered' });
    expect(r.otherTld).toEqual({ error: '"snap.eth" is not a .night name' });
    expect(r.tooLong.error).toMatch(/must be 1 to 32 characters/);
  });
});
