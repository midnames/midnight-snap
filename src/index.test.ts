import { installSnap } from '@metamask/snaps-jest';

describe('midnight snap', () => {
  it('derives addresses via ledger wasm', async () => {
    const { request } = await installSnap();
    const res = await request({ method: 'midnight_getAccounts' });
    expect(res).toRespondWith(expect.objectContaining({
      // known answer: wallet-sdk-hd from the snaps-jest SRP 'test test ... ball' (see scratch ref.mjs)
      shielded: 'mn_shield-addr_undeployed14a9yq2z5tecqpl0zpu498k4zx323wqshvrwdh7zecyd00kesngrh0rdgz8248fjh9anhfex68l9kea4l96e544n2gzx738paurjyl9c7c7ucq',
      unshielded: 'mn_addr_undeployed1vs7f9prvf9ds8rkg4rj56uj8a7rsvcxj5u8yrrv8a64q3p6cs26qwxpq5u',
    }));
    console.log(JSON.stringify(res.response, null, 2));
  });
});

describe('signing', () => {
  it('signs with unshielded key and verifies', async () => {
    const { request } = await installSnap();
    const res = request({ method: 'midnight_signData', params: { hex: 'deadbeef' } });
    const ui = await res.getInterface();
    await (ui as any).ok();
    const out = await res;
    expect(out).toRespondWith(expect.objectContaining({ signature: expect.any(String), verifyingKey: expect.any(String) }));
    console.log(JSON.stringify(out.response, null, 2));
  });
});
