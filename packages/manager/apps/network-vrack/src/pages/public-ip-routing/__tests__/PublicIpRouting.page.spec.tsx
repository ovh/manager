import { labels } from '@/__tests__/I18nTestProvider.utils';
import { checkTextInScreen, checkTextNotInScreen, renderTest } from '@/__tests__/Test.utils';
import { urls } from '@/routes/Routes.constants';

describe('PublicIpRouting', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('should display a public IP routing page', async () => {
    // Given / When
    await renderTest({ initialRoute: urls.dashboard.replace(':serviceName', 'pn-00001') });

    // Then
    await checkTextInScreen(labels.publicIpRouting.publicIpRouting_purpose);

    const expectedRegions = ['eu-west-rbx', 'eu-west-lim', 'eu-central-waw', 'eu-west-par'];
    await Promise.all(expectedRegions.map((region) => checkTextInScreen(region)));

    await checkTextInScreen('5 GB', 4);

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
