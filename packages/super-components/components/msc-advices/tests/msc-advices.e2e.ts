import { setupE2eTest } from './setup';

describe('e2e:msc-advices', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest();

      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });
});
