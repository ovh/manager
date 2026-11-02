import component from '../../../app/components/dedicated-cloud/datacenter/dedicatedCloud-datacenter.component';
import { BACKUP_TAB } from '../../../app/dedicatedCloud/datacenter/backup/backup-tab';

// Top-level stand-ins for the datacenter's tab states.
const BACKUP_STATE = 'backup';
const DASHBOARD_STATE = 'dashboard';
const MBV_DASHBOARD_URL =
  '/beta/#/private-cloud/managed-backup-for-vmware/dashboard';

describe('Backup tab of a PCC datacenter (BKP-1775)', () => {
  let $compile;
  let $q;
  let $rootScope;
  let trackClick;

  beforeEach(() => {
    trackClick = jest.fn();
    angular
      .module('datacenterBackupTabTest', [
        'oui',
        'pascalprecht.translate',
        'ui.router',
      ])
      .component('ovhManagerDedicatedCloudDatacenter', component)
      .config(($stateProvider) => {
        $stateProvider
          .state(DASHBOARD_STATE, { url: '/dashboard' })
          .state(BACKUP_STATE, { url: '/backup' });
      });
    angular.mock.module('datacenterBackupTabTest', ($provide) => {
      $provide.value('coreConfig', {
        getUser: () => ({ ovhSubsidiary: 'FR' }),
      });
      $provide.factory('ovhManagerPccDatacenterService', (_$q_) => ({
        getCommercialRangeName: () => _$q_.resolve('2016'),
      }));
    });
    angular.mock.inject((_$compile_, _$q_, _$rootScope_) => {
      $compile = _$compile_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });
  });

  const render = (backupTab) => {
    const $scope = Object.assign($rootScope.$new(), {
      backupTab,
      datacenter: { model: { id: 1, name: 'Datacenter-1', canOrder: true } },
      trackClick,
    });
    const element = $compile(`
      <ovh-manager-dedicated-cloud-datacenter
        data-datacenter="datacenter"
        data-backup-state="'${BACKUP_STATE}'"
        data-dashboard-state="'${DASHBOARD_STATE}'"
        data-backup-tab="backupTab"
        data-managed-backup-for-vmware-dashboard-url="'${MBV_DASHBOARD_URL}'"
        data-track-click="trackClick"
      ></ovh-manager-dedicated-cloud-datacenter>
    `)($scope);
    $scope.$digest();
    return element[0];
  };

  const backupTabOf = (element) =>
    Array.from(
      element.querySelectorAll('.oui-header-tabs__action'),
    ).find((action) =>
      action.textContent.includes('dedicatedCloud_tab_backup'),
    );

  it('is shown and does nothing while the protection state loads', () => {
    const tab = backupTabOf(render({ target: $q.defer().promise }));

    expect(tab.tagName).toBe('BUTTON');
    expect(tab.getAttribute('href')).toBeNull();
  });

  it('opens the MBV dashboard in a new browser tab, with the external link icon, when the PCC is protected', () => {
    const tab = backupTabOf(
      render({
        target: $q.resolve(BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_APP),
      }),
    );

    expect(tab.tagName).toBe('A');
    expect(tab.getAttribute('href')).toBe(MBV_DASHBOARD_URL);
    expect(tab.getAttribute('target')).toBe('_blank');
    expect(tab.querySelector('.oui-icon-external-link')).not.toBeNull();
    expect(tab.getAttribute('ui-sref')).toBeNull();
  });

  it.each([BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING, BACKUP_TAB.LEGACY])(
    'stays a tab of the datacenter page otherwise (%s)',
    (target) => {
      const tab = backupTabOf(render({ target: $q.resolve(target) }));

      expect(tab.tagName).toBe('A');
      expect(tab.getAttribute('href')).toMatch(/\/backup$/);
      expect(tab.getAttribute('target')).toBeNull();
      expect(tab.querySelector('.oui-icon-external-link')).toBeNull();
    },
  );

  it('is unchanged for Managed Bare Metal, which does not bind it', () => {
    const tab = backupTabOf(render(undefined));

    expect(tab.getAttribute('href')).toMatch(/\/backup$/);
    expect(tab.querySelector('.oui-icon-external-link')).toBeNull();
  });
});
