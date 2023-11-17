/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Locale } from '@ovhcloud/msc-utils';
import { setupSpecTest } from './setup';

describe('specs:msc-network-tile', () => {
  it('renders without error', async () => {
    const {
      page,
      networkTile,
      clipboardBlocks,
      dnsSecondaryBlock,
      olaBlock,
      vrackBlock,
    } = await setupSpecTest({
      locale: 'fr-FR', // Utilisez 'locale' directement
      serviceName: 'ns111111.ovh.net',
    });

    expect(networkTile).toBeTruthy();
    expect(clipboardBlocks).toBeTruthy();
    expect(dnsSecondaryBlock).toBeTruthy();
    expect(olaBlock).toBeTruthy();
    expect(vrackBlock).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  it.each(['fr-FR', 'en-GB'] as Locale[])(
    'Switch locale to %s',
    async (locale) => {
      const { title, tradFR, tradEN } = await setupSpecTest({
        locale,
      });
      expect(title.textContent).toContain(
        locale === 'fr-FR'
          ? tradFR.server_tab_stats_network
          : tradEN.server_tab_stats_network,
      );
    },
  );

  describe('contents', () => {
    it('should display network information with clipboard', async () => {
      const { clipboardBlocks } = await setupSpecTest({
        serviceName: 'ns111111.ovh.net',
      });
      const expectedValues = [
        '321.456.1.789',
        '321.456.1.254',
        '1234:abc:456:def/64',
        '1234:abc:456:def',
        'ns111111testdureverse.ovh.net',
      ];

      const textContentArray = [
        'Ipv4',
        'Gateway IPv4',
        'Ipv6',
        'Gateway IPv6',
        'Reverse',
      ];

      clipboardBlocks.forEach((clipboardBlock, index) => {
        const clipboardElement = clipboardBlock?.querySelector(
          'osds-clipboard',
        );
        const textElement = clipboardBlock?.textContent;

        if (clipboardElement && textElement) {
          const clipboardValue = clipboardElement.getAttribute('value');
          const expectedValue = expectedValues[index];
          const expectedText = textContentArray[index];

          expect(clipboardValue).toEqual(expectedValue);
          expect(textElement).toContain(expectedText);
        }
      });
    });
  });
});
