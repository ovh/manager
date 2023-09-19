import { setupE2eTest } from './setup';

describe('e2e:msc-billing-tile', () => {
  it('should render offer vps-00000000.vps.ovh.net', async () => {
    const { el } = await setupE2eTest();

    expect(el).toBeTruthy();
    expect(el).toHaveClass('hydrated');
  });
});
