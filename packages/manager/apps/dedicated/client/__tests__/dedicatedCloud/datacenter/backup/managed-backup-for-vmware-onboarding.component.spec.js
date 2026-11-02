import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from '../../../../app/components/dedicated-cloud/datacenter/backup/managed-backup-for-vmware-onboarding/managed-backup-for-vmware-onboarding.component';
import {
  formatLongDate,
  isLaunchOfferRunning,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/managed-backup-for-vmware-onboarding/managed-backup-for-vmware-onboarding.controller';
import enGB from '../../../../app/components/dedicated-cloud/datacenter/backup/managed-backup-for-vmware-onboarding/translations/Messages_en_GB.json';

jest.mock(
  '../../../../app/components/dedicated-cloud/datacenter/backup/managed-backup-for-vmware-onboarding/assets/managed-backup-for-vmware.svg',
  () => 'managed-backup-for-vmware.svg',
);

const ORDER_URL = '/beta/#/private-cloud/managed-backup-for-vmware/order';
const PREFIX =
  'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_onboarding';
const DOCS = 'https://docs.ovhcloud.com';

const parisNoon = (day) => new Date(`${day}T12:00:00+01:00`).getTime();

describe('isLaunchOfferRunning (BKP-1775)', () => {
  it.each([
    ['2026-10-29', true],
    ['2027-02-28', true],
    ['2026-10-28', false],
    ['2027-03-01', false],
  ])('on %s, Paris time: %s', (day, running) => {
    expect(isLaunchOfferRunning(parisNoon(day))).toBe(running);
  });

  it('closes at midnight in Paris, not in UTC', () => {
    // 28 February 2027, 23:30 UTC is already 1 March in Paris.
    expect(isLaunchOfferRunning(Date.UTC(2027, 1, 28, 23, 30))).toBe(false);
  });
});

describe('formatLongDate (BKP-1775)', () => {
  it('writes the end of the offer in the language of the user', () => {
    expect(formatLongDate('2027-02-28', 'en_GB')).toBe('28 February 2027');
    expect(formatLongDate('2027-02-28', 'fr_FR')).toBe('28 février 2027');
  });
});

describe('Managed Backup for VMware onboarding in the Backup tab (BKP-1775)', () => {
  let $compile;
  let $rootScope;
  let language;

  beforeEach(() => {
    language = 'en_GB';
    angular
      .module('mbvOnboardingTest', [
        'ngSanitize',
        'pascalprecht.translate',
        OnboardingLayoutHelper,
      ])
      .component(
        'dedicatedCloudDatacenterBackupManagedBackupForVmwareOnboarding',
        component,
      )
      .config(($translateProvider) => {
        $translateProvider.translations('en_GB', enGB);
        $translateProvider.preferredLanguage('en_GB');
      });
    angular.mock.module('mbvOnboardingTest', ($provide) => {
      // The texts are read in en_GB; only the language the controller asks
      // for changes.
      $provide.decorator('$translate', ($delegate) => {
        const { use } = $delegate;
        return Object.assign($delegate, {
          use: (key) => (key ? use(key) : language),
        });
      });
    });
    angular.mock.inject((_$compile_, _$rootScope_) => {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const render = () => {
    const $scope = Object.assign($rootScope.$new(), {
      orderUrl: ORDER_URL,
      trackingPrefix: 'dedicated',
    });
    const element = $compile(`
      <dedicated-cloud-datacenter-backup-managed-backup-for-vmware-onboarding
        data-order-url="orderUrl"
        data-tracking-prefix="trackingPrefix"
      ></dedicated-cloud-datacenter-backup-managed-backup-for-vmware-onboarding>
    `)($scope);
    $scope.$digest();
    return element[0];
  };

  const at = (day) => {
    jest.useFakeTimers({ now: parisNoon(day), doNotFake: ['nextTick'] });
  };

  it('pitches the product with the texts of the MBV app', () => {
    at('2026-11-02');
    const text = render().textContent;

    expect(text).toContain('Managed Backup for VMware');
    expect(text).toContain(enGB[`${PREFIX}_title`]);
    expect(text).toContain(enGB[`${PREFIX}_description`]);
  });

  it('orders on the order page of the app, in the same browser tab, with nothing preselected', () => {
    at('2026-11-02');
    const order = Array.from(render().querySelectorAll('a')).find(
      (link) => link.textContent.trim() === 'Order',
    );

    expect(order.getAttribute('href')).toBe(ORDER_URL);
    expect(order.getAttribute('target')).toBe('_top');
  });

  it('lists the three guides, each in a new browser tab', () => {
    at('2026-11-02');
    const guides = Array.from(render().querySelectorAll('aside a'));

    expect(guides.map((guide) => guide.getAttribute('href'))).toEqual([
      `${DOCS}/en/guides/storage-and-backup/managed-backup-for-vmware/getting-started`,
      `${DOCS}/en/guides/storage-and-backup/managed-backup-for-vmware/tag-vm`,
      `${DOCS}/en/guides/storage-and-backup/managed-backup-for-vmware/migrate`,
    ]);
    guides.forEach((guide) => {
      expect(guide.getAttribute('target')).toBe('_blank');
      expect(guide.textContent).toContain('Tutorial');
    });
    expect(guides[1].textContent).toContain(
      enGB[`${PREFIX}_guide_tag_vm_title`],
    );
  });

  it('opens the French guides for a French-speaking user', () => {
    at('2026-11-02');
    language = 'fr_CA';
    const [guide] = render().querySelectorAll('aside a');

    expect(guide.getAttribute('href')).toBe(
      `${DOCS}/fr/guides/storage-and-backup/managed-backup-for-vmware/getting-started`,
    );
  });

  it('shows the launch offer banner while the offer is open, with its end date', () => {
    at('2027-02-28');
    const banner = render().querySelector('oui-message');

    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain(enGB[`${PREFIX}_launch_offer_title`]);
    expect(banner.textContent).toContain('Order by 28 February 2027');
  });

  it('hides the launch offer banner once the offer is closed', () => {
    at('2027-03-01');

    expect(render().querySelector('oui-message')).toBeNull();
  });

  it('offers nothing of the legacy offer', () => {
    at('2026-11-02');
    const text = render().textContent;

    expect(text).not.toContain('Veeam Managed Backup offer');
    expect(text).not.toMatch(/activate/i);
  });
});
