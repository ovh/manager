import { setupE2eTest, badgesSlotExample, footerSlotExample } from './setup';

describe('e2e:msc-tile', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest({
        html: `${footerSlotExample}${badgesSlotExample}`,
      });
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });
});
