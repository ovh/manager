import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';
import { fromIpToId } from '@/utils/ipFormatter';

describe('DeleteVrackIpv6', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a modal to detach IPv6 from Vrack', async () => {
    // Given
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    // Open the detach modal directly via its route (more reliable than clicking through the UI)
    await renderTest({
      initialRoute: urls.detachIpv6
        .replace(':serviceName', 'pn-00001')
        .replace(':ip', fromIpToId('2001:41d0:a800:2700::/56')!),
    });

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_ipv6_title);
    await checkTextInScreen(
      labels.publicIpRouting.publicIpRouting_region_detach_ipv6_message.replace(
        '{{ip}}',
        '2001:41d0:a800:2700::/56',
      ),
    );
  });
});
