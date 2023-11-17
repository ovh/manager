import { setupE2eTest } from './setup';

describe('e2e:msc-network-tile', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest({
        html: 'test',
      });
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });
});
