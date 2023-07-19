import { setupE2eTest } from './setup';

describe('e2e:msc-billing-tile', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest({
        html: ``,
      });
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });
});
