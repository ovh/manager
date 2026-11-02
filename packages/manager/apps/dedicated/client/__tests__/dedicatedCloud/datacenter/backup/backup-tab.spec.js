import Backup from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.class';
import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLED,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.constants';
import {
  BACKUP_TAB,
  MANAGED_BACKUP_FOR_VMWARE_API,
  getBackupTab,
  isProtectedByManagedBackupForVmware,
  selectManagedBackupVspcTenant,
} from '../../../../app/dedicatedCloud/datacenter/backup/backup-tab';

const PCC = 'pcc-145-239-12-34';

const managedBackup = (hostedPrivateCloudServiceName, resourceStatus) => ({
  id: `managed-backup-${hostedPrivateCloudServiceName}`,
  resourceStatus,
  currentState: { hostedPrivateCloudServiceName },
});

const mbvVspcTenant = {
  id: 'vspc-mbv',
  currentState: { vspcType: 'ADVANCED', enabledAddons: ['MANAGED_BACKUP'] },
};
const licensesVspcTenant = {
  id: 'vspc-licenses',
  currentState: { vspcType: 'ADVANCED', enabledAddons: ['BACKUP_LICENSES'] },
};
const agentsVspcTenant = {
  id: 'vspc-agents',
  currentState: { vspcType: 'BASIC', enabledAddons: ['MANAGED_BACKUP'] },
};

describe('selectManagedBackupVspcTenant (BKP-1775)', () => {
  it('keeps only an ADVANCED VSPC tenant carrying the MBV add-on', () => {
    expect(
      selectManagedBackupVspcTenant([
        agentsVspcTenant,
        licensesVspcTenant,
        mbvVspcTenant,
      ]),
    ).toBe(mbvVspcTenant);
    expect(
      selectManagedBackupVspcTenant([agentsVspcTenant, licensesVspcTenant]),
    ).toBeUndefined();
  });
});

describe('isProtectedByManagedBackupForVmware (BKP-1775)', () => {
  it.each(['CREATING', 'READY', 'SUSPENDED', 'ERROR'])(
    'counts a Service of this PCC whatever its state (%s)',
    (resourceStatus) => {
      expect(
        isProtectedByManagedBackupForVmware(
          [managedBackup(PCC, resourceStatus)],
          PCC,
        ),
      ).toBe(true);
    },
  );

  it('ignores the Services of the other PCCs', () => {
    expect(
      isProtectedByManagedBackupForVmware(
        [managedBackup('pcc-other', 'READY')],
        PCC,
      ),
    ).toBe(false);
    expect(isProtectedByManagedBackupForVmware([], PCC)).toBe(false);
  });
});

describe('getBackupTab (BKP-1775)', () => {
  let $httpBackend;
  let $http;
  let $q;
  let $rootScope;

  beforeEach(() => {
    angular.mock.inject((_$httpBackend_, _$http_, _$q_, _$rootScope_) => {
      $httpBackend = _$httpBackend_;
      $http = _$http_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  const resolveTab = ({
    backupState = BACKUP_STATE_DISABLED,
    mbvOpen = true,
    backupFails = false,
    readsServices = false,
  } = {}) => {
    let target;
    getBackupTab({
      $http,
      $q,
      backupOrderAvailability: $q.resolve({
        canOrderBackup: true,
        isManagedBackupForVmwareOpen: mbvOpen,
      }),
      getBackup: () =>
        backupFails
          ? $q.reject(new Error('unreachable'))
          : $q.resolve(new Backup({ state: backupState })),
      serviceName: PCC,
    }).then((result) => {
      target = result;
    });
    $rootScope.$digest();
    if (readsServices) {
      $httpBackend.flush();
    }
    return target;
  };

  const expectServices = (managedBackups) => {
    $httpBackend
      .expectGET(MANAGED_BACKUP_FOR_VMWARE_API.TENANTS)
      .respond([{ id: 'tenant-licenses' }, { id: 'tenant-mbv' }]);
    $httpBackend
      .expectGET(MANAGED_BACKUP_FOR_VMWARE_API.VSPC_TENANTS('tenant-licenses'))
      .respond([licensesVspcTenant]);
    $httpBackend
      .expectGET(MANAGED_BACKUP_FOR_VMWARE_API.VSPC_TENANTS('tenant-mbv'))
      .respond([agentsVspcTenant, mbvVspcTenant]);
    $httpBackend
      .expectGET(
        MANAGED_BACKUP_FOR_VMWARE_API.MANAGED_BACKUPS('tenant-mbv', 'vspc-mbv'),
      )
      .respond(managedBackups);
  };

  it('keeps the current tab where MBV is closed (SNC), without reading MBV', () => {
    expect(resolveTab({ mbvOpen: false })).toBe(BACKUP_TAB.LEGACY);
  });

  it('keeps the current tab where the legacy offer is enabled', () => {
    expect(resolveTab({ backupState: BACKUP_STATE_ENABLED })).toBe(
      BACKUP_TAB.LEGACY,
    );
  });

  it.each(['enabling', 'removing'])(
    'keeps the current tab while the legacy offer is %s',
    (backupState) => {
      expect(resolveTab({ backupState })).toBe(BACKUP_TAB.LEGACY);
    },
  );

  it('keeps the current tab when the legacy backup cannot be read', () => {
    expect(resolveTab({ backupFails: true })).toBe(BACKUP_TAB.LEGACY);
  });

  it('opens the MBV app when an MBV Service has this PCC as its infrastructure', () => {
    expectServices([managedBackup(PCC, 'SUSPENDED')]);
    expect(resolveTab({ readsServices: true })).toBe(
      BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_APP,
    );
  });

  it('shows the onboarding when no MBV Service protects this PCC', () => {
    expectServices([managedBackup('pcc-other', 'READY')]);
    expect(resolveTab({ readsServices: true })).toBe(
      BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING,
    );
  });

  it('shows the onboarding when no tenant carries the MBV add-on', () => {
    $httpBackend
      .expectGET(MANAGED_BACKUP_FOR_VMWARE_API.TENANTS)
      .respond([{ id: 'tenant-licenses' }]);
    $httpBackend
      .expectGET(MANAGED_BACKUP_FOR_VMWARE_API.VSPC_TENANTS('tenant-licenses'))
      .respond([licensesVspcTenant]);
    expect(resolveTab({ readsServices: true })).toBe(
      BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING,
    );
  });

  it('shows the onboarding when the MBV Services cannot be read', () => {
    $httpBackend.expectGET(MANAGED_BACKUP_FOR_VMWARE_API.TENANTS).respond(500);
    expect(resolveTab({ readsServices: true })).toBe(
      BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING,
    );
  });
});
