import { setupE2eTest } from './setup';

import { LogEntry } from '../src/msc-tail-logs/types';

describe('screenshot:msc-tail-logs', () => {
  describe('screenshots', () => {
    const attributesList: Array<Partial<LogEntry>> = [
      {},
      { content: 'Other test' } as Partial<LogEntry>,
    ];

    attributesList.forEach((attributes) => {
      ['', 'test'].forEach((html) => {
        it([JSON.stringify(attributes), html].join(', '), async () => {
          const { page } = await setupE2eTest({
            attributes,
            html,
          });
          await page.waitForChanges();

          await page.evaluate(async () => {
            const element = document.querySelector<HTMLElement>(
              'msc-tail-logs',
            );

            return {
              width: element?.clientWidth,
              height: element?.clientHeight,
            };
          });
          await page.setViewport({ width: 600, height: 600 });
          const results = await page.compareScreenshot('Manager tail logs', {
            fullPage: false,
            omitBackground: true,
          });
          expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0 });
        });
      });
    });
  });
});
