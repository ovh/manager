import { HTMLStencilElement } from '@stencil/core/internal';
import { setupE2eTest } from './setup';

describe('screenshot:msc-billing-tile', () => {
  describe('screenshots', () => {
    [
      {
        testCase: 'english language',
        language: 'en-GB',
        servicePath: 'vps/vps-00000000.vps.ovh.net',
      },
      {
        testCase: 'Offer without menu',
        servicePath: 'emails/domain/domain-test.ovh',
      },
      {
        testCase: 'Offer and a menu to change offer',
        servicePath: 'hosting/web/abcdef.test.hosting.ovh.net',
      },
      {
        testCase: 'Delete at expiration',
        servicePath: 'vps/vps-99999999.vps.ovh.net',
      },
      {
        testCase: 'Expired service',
        servicePath: 'vps/vps-33333333.vps.ovh.net',
      },
      {
        testCase: 'Contact list with owner',
        servicePath: 'domain/domain-test.ovh',
      },
    ].forEach((attributes) => {
      it(attributes.testCase, async () => {
        const { page } = await setupE2eTest(attributes);
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
        expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0.01 });
      });
    });
  });
});
