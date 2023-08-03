import { HTMLStencilElement } from '@stencil/core/internal';
import { setupE2eTest } from './setup';

jest.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: jest.fn(() => Promise.resolve({})),
  },
}));

describe('screenshot:msc-billing-tile', () => {
  describe('screenshots', () => {
    [
      {
        language: 'fr-FR',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
      {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
      {
        servicePath: 'dedicated/nasha/zpool-128894',
        offer: 'zpool-128894',
        dataTracking: 'home:dashboard:tuto',
      },
    ].forEach((attributes) => {
      it([JSON.stringify(attributes)].join(', '), async () => {
        const { page } = await setupE2eTest({
          attributes: {
            language: 'en-GB',
            servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
            offer: 'vps-0baa4fcf.vps.ovh.net',
          },
        });
        await page.waitForChanges();

        await page.evaluate(async () => {
          const element = document.querySelector<HTMLStencilElement>(
            'msc-billing-tile',
          );

          return {
            width: element?.clientWidth,
            height: element?.clientHeight,
          };
        });
        await page.setViewport({ width: 600, height: 600 });
        const results = await page.compareScreenshot('Manager Billing Tile', {
          fullPage: false,
          omitBackground: true,
        });
        expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0 });
      });
    });
  });
});
