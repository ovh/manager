import { vi } from 'vitest';

import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, checkTextNotInScreen, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';

vi.mock('@/hooks/vrack-ip/useGetBandwidthByRegions', () => ({
  useGetBandwidthByRegions: () => ({
    regionsWithBandwidth: [
      {
        region: 'eu-west-rbx',
        bandwidthLimitType: 'default',
        bandwidthLimit: 5000,
        ipv4List: ['5.39.12.96/28', '5.135.62.80/28'],
        ipv6List: [{ ipv6: '2001:41d0:b00:1b00::/56', region: 'eu-west-rbx' }],
      },
      {
        region: 'eu-west-lim',
        bandwidthLimitType: 'default',
        bandwidthLimit: 5000,
        ipv4List: [],
        ipv6List: [{ ipv6: '2001:41d0:f00:9c00::/56', region: 'eu-west-lim' }],
      },
      {
        region: 'eu-central-waw',
        bandwidthLimitType: 'default',
        bandwidthLimit: 5000,
        ipv4List: [],
        ipv6List: [{ ipv6: '2001:41d0:a800:2700::/56', region: 'eu-central-waw' }],
      },
      {
        region: 'eu-west-par',
        bandwidthLimitType: 'default',
        bandwidthLimit: 5000,
        ipv4List: [],
        ipv6List: [{ ipv6: '2001:41d0:a900:1d00::/56', region: 'eu-west-par' }],
      },
    ],
    isLoading: false,
  }),
}));

vi.mock('@ovh-ux/manager-network-common', async () => {
  const original = await vi.importActual('@ovh-ux/manager-network-common');
  return {
    ...original,
    useVrackBandwidthCartOptions: () => ({
      vrackCartBandwidthOptionListByRegion: {},
      isLoading: false,
    }),
  };
});

describe('PublicIpRouting', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display a public IP routing page', async () => {
    // Given / When
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_purpose);

    const expectedRegions = ['eu-west-rbx', 'eu-west-lim', 'eu-central-waw', 'eu-west-par'];
    await Promise.all(expectedRegions.map((region) => checkTextInScreen(region)));

    const expectedIps = [
      '5.39.12.96/28',
      '5.135.62.80/28',
      '2001:41d0:f00:9c00::/56',
      '2001:41d0:a800:2700::/56',
      '2001:41d0:b00:1b00::/56',
      '2001:41d0:a900:1d00::/56',
    ];
    await Promise.all(expectedIps.map((ip) => checkTextInScreen(ip)));

    await checkTextInScreen('5 unit_size_GB');

    const unExpectedRegions = [
      'eu-south-mil',
      'eu-west-eri',
      'eu-west-gra',
      'eu-west-sbg',
      'ap-south-mum',
      'ap-southeast-sgp',
      'ap-southeast-syd',
      'ca-east-bhs',
      'ca-east-tor',
    ];
    await Promise.all(unExpectedRegions.map((region) => checkTextNotInScreen(region)));
  });
});
