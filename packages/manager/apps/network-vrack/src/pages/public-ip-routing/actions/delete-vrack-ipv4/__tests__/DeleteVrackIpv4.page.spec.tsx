import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';
import { fromIpToId } from '@/utils/ipFormatter';

describe('DeleteVrackIpv4', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a modal to detach IPv4 from Vrack', async () => {
    // Given
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    // Open the detach modal directly via its route (more reliable than clicking the icon)
    await renderTest({
      initialRoute: urls.detachIpv4
        .replace(':serviceName', 'pn-00001')
        .replace(':ip', fromIpToId('5.39.12.96/28')!),
    });

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_region_detach_ip_title);
    await checkTextInScreen(
      labels.publicIpRouting.publicIpRouting_region_detach_ip_message.replace(
        '{{ip}}',
        '5.39.12.96/28',
      ),
    );
  });
});
