import { labels } from '@/__tests__/I18nTestProvider.utils';
import {
  checkTextInScreen,
  clickElementByTestId,
  clickElementByText,
  renderTest,
} from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';

describe('DeleteVrackIpv6', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a modal to detach IPv6 from Vrack', async () => {
    // Given
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    // When
    await clickElementByTestId(`action-menu-2001:41d0:a800:2700::/56`);
    await clickElementByText(labels.publicIpRouting.publicIpRouting_region_actionMenu_detach_ip);

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
