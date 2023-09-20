import { setupE2eTest } from './setup';

describe('e2e:msc-tail-logs', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest();
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });
});
