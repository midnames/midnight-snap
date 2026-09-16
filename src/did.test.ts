import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// The bindings need the compact-runtime wasm, which jest's CJS transform cannot load, so run them in Node. The fixture
// is the stagenet DID that snap.night links to, with a `midns` service that names snap.night.
const run = (script: string) =>
  JSON.parse(execFileSync(process.execPath, ['--input-type=module', '--no-warnings', '-e', script], { cwd: __dirname, encoding: 'utf8' }));

const DID = 'did:midnight:stagenet:f63ba2791972e511dccca154d75df67ed22cdaccb3d01f539fbfbeda0eb07679';

describe('did:midnight', () => {
  it('resolves a DID document from contract state, and reports the resolution errors', () => {
    const r = run(`
      const { readFileSync } = await import('node:fs');
      const { resolveDidWith } = await import(${JSON.stringify(join(__dirname, 'did.ts'))});
      const f = JSON.parse(readFileSync(${JSON.stringify(join(__dirname, 'did.fixture.json'))}, 'utf8'));
      const read = async (address) => (address === f.did.split(':')[3] ? f.stateHex : null);
      process.stdout.write(JSON.stringify({
        found: await resolveDidWith('stagenet', f.did, read),
        missing: (await resolveDidWith('stagenet', 'did:midnight:stagenet:${'00'.repeat(32)}', read)).didResolutionMetadata,
        otherNetwork: (await resolveDidWith('stagenet', 'did:midnight:undeployed:${'00'.repeat(32)}', read)).didResolutionMetadata,
        invalid: (await resolveDidWith('stagenet', 'did:midnight:stagenet:xyz', read)).didResolutionMetadata,
      }));`);
    expect(r.found.didResolutionMetadata).toEqual({});
    expect(r.found.didDocument).toMatchObject({
      id: DID,
      controller: DID,
      service: [{ id: `${DID}#midns`, type: 'MidnamesName', serviceEndpoint: 'midns:snap.night' }],
    });
    expect(r.found.didDocumentMetadata).toMatchObject({ versionId: '1' });
    expect(r.missing).toEqual({ error: 'notFound' });
    expect(r.otherNetwork).toEqual({ error: 'methodNotSupported' });
    expect(r.invalid.error).toBeDefined();
  });
});
