import { setupSpecTest } from './setup';

describe('specs:msc-tail-logs', () => {
  it('renders without error', async () => {
    const { code } = await setupSpecTest();

    expect(code?.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('renders colors according to the log type', async () => {
    const { code } = await setupSpecTest({
      source:
        'cloud/project/33333333333333333333/database/mongodb/33333333-33333-333333-3333333333/logs',
    });

    expect(code?.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('renders a message if there is no log to display', async () => {
    const { codeBlock, tradFR } = await setupSpecTest({
      source:
        'cloud/project/emptylogs/database/mongodb/44444444444-4444-44444444444444/logs',
    });

    expect(codeBlock?.textContent).toEqual(tradFR.empty_logs);
  });

  describe('error handling', () => {
    it('displays an error if the source does not respond', async () => {
      const { codeBlock, tradFR } = await setupSpecTest({
        source: '/notfound',
      });

      expect(codeBlock?.textContent).toEqual(tradFR.service_error_message);
    });

    it('displays an error if the source answers with an error', async () => {
      const { codeBlock, tradFR } = await setupSpecTest({
        source:
          'cloud/project/servererror/database/mongodb/55555555555-5555-55555555555555/logs',
      });

      expect(codeBlock?.textContent).toEqual(tradFR.service_error_message);
    });
  });

  describe('auto-refresh', () => {
    it('does not if refresh by default', async () => {
      const { page, mock } = await setupSpecTest();

      expect(mock.history.get).toHaveLength(1);
      mock.resetHistory();

      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1);
      });
      await page.waitForChanges();

      expect(mock.history.get).toHaveLength(0);
    });

    it('refresh the content if refresh is activated', async () => {
      const { page, mock } = await setupSpecTest({
        autoRefresh: true,
        refreshInterval: 1,
      });

      expect(mock.history.get).toHaveLength(1);
      mock.resetHistory();

      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1);
      });
      await page.waitForChanges();

      expect(mock.history.get.length).toBeGreaterThanOrEqual(1);
    });
  });
});
