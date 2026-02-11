import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, clickElementByTestId, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';

describe('DeleteVrackIpv6Subrange', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a modal to detach IPv6 routed subrange from Vrack', async () => {
    // Given
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    await clickElementByTestId(`unfold-ip-2001:41d0:f00:9c00::/56`);
    await checkTextInScreen('2001:41d0:f00:9d00::/60');

    // When
    await clickElementByTestId(`trash-subrange-2001:41d0:f00:9d00::/60`);

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_subrange_title);
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_subrange_message);
  });
});
