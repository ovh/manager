import { setupE2eTest } from './setup';

describe('screenshot:msc-tail-logs', () => {
  describe('screenshots', () => {
    [
      {
        useCase: 'asc logs',
        source:
          'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs',
        sort: 'asc',
      },
      {
        useCase: 'limited logs',
        source:
          'cloud/project/22222222222222222222/database/mongodb/22222222-22222-222222-2222222222/logs',
        sort: 'asc',
        limit: 2,
        autoRefresh: true,
        refreshInterval: 10000,
      },
      {
        useCase: 'desc logs',
        source:
          'cloud/project/33333333333333333333/database/mongodb/33333333-33333-333333-3333333333/logs',
        sort: 'desc',
      },
      {
        useCase: 'empty logs',
        source:
          'cloud/project/emptylogs/database/mongodb/1fdsfds0987-4123-eHJHfdsfsd1234/logs',
        locale: 'en-GB',
      },
      {
        useCase: 'source not found',
        source: 'notfound',
      },
      {
        useCase: 'server error',
        source:
          'cloud/project/servererror/database/mongodb/1fdsfds0987-4123-eHJHfdsfsd1234/logs',
      },
    ].forEach((attributes) => {
      it(attributes.useCase, async () => {
        const { page } = await setupE2eTest(attributes as any);
        await page.waitForChanges();

        await page.evaluate(async () => {
          const element = document.querySelector<HTMLElement>('msc-tail-logs');

          return {
            width: element?.clientWidth,
            height: element?.clientHeight,
          };
        });
        await page.setViewport({ width: 600, height: 600 });
        const results = await page.compareScreenshot('Tail logs', {
          fullPage: false,
          omitBackground: true,
        });
        expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0 });
      });
    });
  });
});
