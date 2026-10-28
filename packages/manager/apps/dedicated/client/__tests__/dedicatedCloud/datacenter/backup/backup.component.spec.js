import Backup from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.class';
import component from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.component';
import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLED,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.constants';

const MBV_URL = '/beta/#/private-cloud/managed-backup-for-vmware';

describe('dedicatedCloudDatacenterBackup component (BKP-1758)', () => {
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
        data-managed-backup-for-vmware-url="managedBackupForVmwareUrl"
      ></dedicated-cloud-datacenter-backup>
    `)($scope);
    $scope.$digest();
    return element[0];
  };

  const text = (element) => element.textContent;

  it('orients a datacenter without backup to Managed Backup for VMware when MBV blocks the order', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_DISABLED }),
      canOrderBackup: true,
      isOrderBlocked: true,
      managedBackupForVmwareUrl: MBV_URL,
    });

    expect(text(element)).toContain(
      'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_order_info',
    );
    const link = element.querySelector(`a[href="${MBV_URL}"]`);
    expect(link).not.toBeNull();
    expect(link.getAttribute('target')).toBe('_top');
    expect(text(link)).toContain(
      'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_order_link',
    );
    expect(element.querySelector('.datacenter-backup')).toBeNull();
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_order_warning',
    );
  });

  it('shows the MBV message, not the out-of-stock warning, when both block', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_DISABLED }),
      canOrderBackup: false,
      isOrderBlocked: true,
      managedBackupForVmwareUrl: MBV_URL,
    });

    expect(text(element)).toContain(
      'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_order_info',
    );
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
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_order_info',
    );
  });

  it('leaves an existing customer everything, without the MBV message, when MBV is open', () => {
    const element = render({
      backup: new Backup({ state: BACKUP_STATE_ENABLED }),
      canOrderBackup: true,
      isOrderBlocked: false,
      managedBackupForVmwareUrl: MBV_URL,
    });

    expect(element.querySelector('.datacenter-backup')).not.toBeNull();
    expect(element.querySelector('#backupCapabilitiesForm')).not.toBeNull();
    expect(text(element)).not.toContain(
      'dedicatedCloud_datacenter_backup_managed_backup_for_vmware_order_info',
    );
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
