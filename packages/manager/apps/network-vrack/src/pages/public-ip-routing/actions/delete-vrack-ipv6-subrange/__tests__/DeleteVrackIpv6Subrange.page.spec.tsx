import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';
import { fromIpToId } from '@/utils/ipFormatter';

describe('DeleteVrackIpv6Subrange', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a modal to detach IPv6 routed subrange from Vrack', async () => {
    // Given: render the page and open the detach-subrange modal directly via route (more reliable)
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    await renderTest({
      initialRoute: urls.detachIpv6Subrange
        .replace(':serviceName', 'pn-00001')
        .replace(':ip', fromIpToId('2001:41d0:f00:9c00::/56')!)
        .replace(':subrange', fromIpToId('2001:41d0:f00:9d00::/60')!),
    });

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_subrange_title);
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_subrange_message);
  });
});
