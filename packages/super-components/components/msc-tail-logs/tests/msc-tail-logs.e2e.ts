import { setupE2eTest } from './setup';
import { mongoDbLogsASC } from './mockRequest';

jest.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v6: {
      get: jest.fn(() =>
        Promise.resolve({
          data: mongoDbLogsASC,
        }),
      ),
    },
  },
}));

describe('e2e:msc-tail-logs', () => {
  describe('defaults', () => {
    it('should render', async () => {
      const { el } = await setupE2eTest({
        html: 'test',
      });
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });

  describe('custom scenarios', () => {
    it('should match mongoDbLogsASC', async () => {
      // Setup the test environment
      const { page } = await setupE2eTest({
        html:
          '<msc-tail-logs source="cloud/project/5a6980507c0a40dca362eb9b22d79044/database/mongodb/5ed952db-0824-4173-b1ab-e524f4d4d480/logs" sort="asc"></msc-tail-logs>',
      });

      // Wait for changes to be applied
      await page.waitForChanges();
    });
  });
});
