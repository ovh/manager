import { HTMLStencilElement } from '@stencil/core/internal';
import { setupE2eTest, badgesSlotExample, footerSlotExample } from './setup';

const imgSrc =
  'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png';

describe('screenshot:msc-tile', () => {
  describe('screenshots', () => {
    [
      {},
      { imgSrc, imgAlt: 'test' },
      { isExternal: true },
      { isExternal: true, imgSrc, imgAlt: 'test' },
    ].forEach((attributes) => {
      [
        '',
        `${badgesSlotExample}${footerSlotExample}`,
        badgesSlotExample,
        footerSlotExample,
      ].forEach((html) => {
        it([JSON.stringify(attributes), html].join(', '), async () => {
          const { page } = await setupE2eTest({
            attributes,
            html,
          });
          await page.waitForChanges();

          await page.evaluate(async () => {
            const element = document.querySelector<HTMLStencilElement>(
              'msc-tile',
            );

            return {
              width: element?.clientWidth,
              height: element?.clientHeight,
            };
          });
          await page.setViewport({ width: 600, height: 600 });
          const results = await page.compareScreenshot('Manager Tile', {
            fullPage: false,
            omitBackground: true,
          });
          expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0 });
        });
      });
    });
  });
});
