import { HTMLStencilElement } from '@stencil/core/internal';
import { Locale } from '@ovhcloud/msc-utils';
import { setupE2eTest } from './setup';

describe('screenshot:msc-advices', () => {
  describe('screenshots', () => {
    [
      {
        testCase: 'domain english locale',
        locale: 'en-GB' as Locale,
        serviceType: 'domain-web',
        serviceName: 'abcd1234.fr',
      },
      {
        testCase: 'domain french locale',
        locale: 'fr-FR' as Locale,
        serviceType: 'domain-web',
        serviceName: 'abcd1234.fr',
      },
      {
        testCase: 'VPS',
        serviceType: 'vps',
        serviceName: 'vps-abcd1234.vps.ovh.net',
      },
    ].forEach((attributes) => {
      it(attributes.testCase, async () => {
        const { page } = await setupE2eTest(attributes);
        await page.waitForChanges();

        await page.evaluate(async () => {
          const element = document.querySelector<HTMLStencilElement>(
            'msc-advices',
          );

          return {
            width: element?.clientWidth,
            height: element?.clientHeight,
          };
        });
        await page.setViewport({ width: 600, height: 600 });
        const results = await page.compareScreenshot('Manager Advices Tile', {
          fullPage: false,
          omitBackground: true,
        });
        expect(results).toMatchScreenshot({ allowableMismatchedRatio: 0.01 });
      });
    });
  });
});
