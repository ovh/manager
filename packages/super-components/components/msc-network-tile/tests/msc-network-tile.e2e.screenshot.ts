import { setupE2eTest } from './setup';

describe('screenshot:msc-network-tile', () => {
  describe('screenshots', () => {
    [{}, { content: 'Other test' }].forEach((attributes) => {
      ['', 'test'].forEach((html) => {
        it([JSON.stringify(attributes), html].join(', '), async () => {
          const { page } = await setupE2eTest({
            attributes,
            html,
          });
          await page.waitForChanges();

          await page.evaluate(async () => {
            const element = document.querySelector<HTMLElement>(
              'msc-network-tile',
            );

            return {
              width: element?.clientWidth,
              height: element?.clientHeight,
            };
          });
          await page.setViewport({ width: 600, height: 600 });
          const results = await page.compareScreenshot('Manager Network Tile', {
            fullPage: false,
            omitBackground: true,
          });
          expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0 });
        });
      });
    });
  });
});
