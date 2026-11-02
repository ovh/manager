import Backup from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.class';
import component from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.component';
import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLED,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.constants';

const MBV_ORDER_URL = '/beta/#/private-cloud/managed-backup-for-vmware/order';
const ONBOARDING =
  'dedicated-cloud-datacenter-backup-managed-backup-for-vmware-onboarding';

describe('dedicatedCloudDatacenterBackup component (BKP-1758, BKP-1775)', () => {
  let $compile;
  let $rootScope;

  beforeEach(() => {
    angular
      .module('backupComponentTest', ['pascalprecht.translate'])
      .component('dedicatedCloudDatacenterBackup', component);
    angular.mock.module('backupComponentTest', ($provide) => {
      $provide.value('Alerter', { success: jest.fn(), error: jest.fn() });
      $provide.value('atInternet', { trackClick: jest.fn() });
      $provide.value('dedicatedCloudDatacenterBackupService', {});
    });
    angular.mock.inject((_$compile_, _$rootScope_) => {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  const render = (bindings) => {
    const $scope = Object.assign($rootScope.$new(), {
      backupOffers: [],
      operationsUrl: '',
      trackingPrefix: 'dedicated',
      ...bindings,
    });
    const element = $compile(`
      <dedicated-cloud-datacenter-backup
        data-backup="backup"
        data-backup-offers="backupOffers"
        data-backup-offers-under-process="false"
        data-operations-url="operationsUrl"
        data-tracking-prefix="trackingPrefix"
        data-can-order-backup="canOrderBackup"
        data-is-order-blocked-by-managed-backup-for-vmware="isOrderBlocked"
        data-managed-backup-for-vmware-order-url="managedBackupForVmwareOrderUrl"
      ></dedicated-cloud-datacenter-backup>
    `)($scope);
    $scope.$digest();
    return element[0];
  };

  const text = (element) => element.textContent;

  it('shows the Managed Backup for VMware onboarding, and only it, when MBV blocks the order', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_DISABLED }),
      canOrderBackup: true,
      isOrderBlocked: true,
      managedBackupForVmwareOrderUrl: MBV_ORDER_URL,
    });

    const onboarding = element.querySelector(ONBOARDING);
    expect(onboarding).not.toBeNull();
    expect(onboarding.getAttribute('data-order-url')).toBe(
      '$ctrl.managedBackupForVmwareOrderUrl',
    );
    expect(element.querySelector('.datacenter-backup')).toBeNull();
    expect(element.querySelector('.datacenter-backup-header')).toBeNull();
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
  });

  it('shows the onboarding, not the out-of-stock warning, when both block', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_DISABLED }),
      canOrderBackup: false,
      isOrderBlocked: true,
      managedBackupForVmwareOrderUrl: MBV_ORDER_URL,
    });

    expect(element.querySelector(ONBOARDING)).not.toBeNull();
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
  });

  it('keeps the current warning when dedicated-cloud:canOrderBackup is what blocks', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_ENABLED }),
      canOrderBackup: false,
      isOrderBlocked: false,
    });

    expect(text(element)).toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
    expect(element.querySelector(ONBOARDING)).toBeNull();
  });

  it('leaves an existing customer everything, without the onboarding, when MBV is open', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_ENABLED }),
      canOrderBackup: true,
      isOrderBlocked: false,
      managedBackupForVmwareOrderUrl: MBV_ORDER_URL,
    });

    expect(element.querySelector('.datacenter-backup')).not.toBeNull();
    expect(element.querySelector('#backupCapabilitiesForm')).not.toBeNull();
    expect(element.querySelector(ONBOARDING)).toBeNull();
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
  });

  it('is unchanged for Managed Bare Metal, which does not bind the MBV rule', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_ENABLED }),
      canOrderBackup: false,
    });

    expect(element.querySelector('.datacenter-backup')).not.toBeNull();
    expect(text(element)).toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
  });
});
