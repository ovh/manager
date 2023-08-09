import { setupSpecTest } from './setup';
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

describe('MscTailLogs Component', () => {
  it('renders without error', async () => {
    const { page } = await setupSpecTest({});
    expect(page.root).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  it('renders with custom content', async () => {
    const { page } = await setupSpecTest({});

    await page.waitForChanges();

    const contentElement = page.root?.shadowRoot?.querySelector(
      '.msc-tail-wrapper osds-code',
    );

    expect(contentElement).toBeTruthy();
  });

  it('toggles auto-refresh interval', async () => {
    const { page } = await setupSpecTest({});
    const component = page.rootInstance;

    component.isToggled = true;
    await page.waitForChanges();

    expect(component.startLogsRefresh).toBeTruthy();

    component.isToggled = false;
    await page.waitForChanges();

    expect(component.stopLogsRefresh).toBeTruthy();
  });
  it('handles no logs gracefully', async () => {
    const { page } = await setupSpecTest({});
    const component = page.rootInstance;

    component.logs = [];
    await page.waitForChanges();

    const contentElement = page.root?.shadowRoot?.querySelector(
      '.msc-tail-wrapper osds-code',
    );
    expect(contentElement).toBeFalsy();
  });
  t(
    'fetches limited number of logs based on the provided logLimit',
    async () => {
      const customLogLimit = 100;
      const { page } = await setupSpecTest({ logLimit: customLogLimit });

      await page.waitForChanges();

      const { logs } = page.rootInstance;
      expect(fetchLogs).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        customLogLimit,
      );
      // Add more assertions as needed
    },
  );
});
