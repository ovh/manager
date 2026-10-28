import Backup from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.class';
import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLED,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.constants';
import backupRouting from '../../../../app/dedicatedCloud/datacenter/backup/backup.routing';
import minimumHostsRouting from '../../../../app/dedicatedCloud/datacenter/backup/minimumHosts/minimumHosts.routing';
import newRouting from '../../../../app/dedicatedCloud/datacenter/backup/new/new.routing';
import splaLicenceRouting from '../../../../app/dedicatedCloud/datacenter/backup/splaLicence/splaLicence.routing';
import {
  CAN_ORDER_BACKUP_FEATURE,
  MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
  MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE,
} from '../../../../app/dedicatedCloud/datacenter/backup/backup-order-availability';

const BACKUP_STATE = 'app.dedicatedCloud.details.datacenter.details.backup';
const MBV_OPEN = [
  CAN_ORDER_BACKUP_FEATURE,
  MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
];

describe('PCC datacenter backup routing (BKP-1758)', () => {
  let $state;
  let $rootScope;
  let lastTransition;

  const setup = ({
    backupState = BACKUP_STATE_DISABLED,
    backupOffer = 'classic',
    isTrusted = false,
    features = [CAN_ORDER_BACKUP_FEATURE],
    featureFlippingFails = false,
    isSplaActive = true,
    hostCount = 3,
  } = {}) => {
    beforeEach(() => {
      angular.module('backupRoutingTest', ['ui.router']);
      angular
        .module('backupRoutingTest')
        .config(backupRouting)
        .config(newRouting)
        .config(splaLicenceRouting)
        .config(minimumHostsRouting);

      angular.mock.module('backupRoutingTest', ($provide, $stateProvider) => {
        $stateProvider
          .state('app', {})
          .state('app.dedicatedCloud', {})
          .state('app.dedicatedCloud.details', {})
          .state('app.dedicatedCloud.details.datacenter', {})
          .state('app.dedicatedCloud.details.datacenter.details', {
            url: '/:productId/:datacenterId',
            resolve: {
              productId: () => 'pcc-1',
              datacenterId: () => '1',
              datacenterList: () => [{ id: 1 }],
              currentService: () => ({ usesLegacyOrder: false }),
              currentUser: () => ({ ovhSubsidiary: 'FR', isTrusted }),
            },
          })
          .state('app.dedicatedCloud.details.operation', {})
          .state('app.dedicatedCloud.details.license', {})
          .state(
            'app.dedicatedCloud.details.datacenter.details.hosts.order',
            {},
          );

        $provide.value('$translate', {
          instant: (key) => key,
          use: () => 'fr_FR',
        });
        $provide.value('Alerter', { set: jest.fn() });
        $provide.value('coreConfig', {
          getUser: () => ({ isTrusted }),
          getRegion: () => 'EU',
        });
        $provide.factory('ovhFeatureFlipping', (_$q_) => ({
          checkFeatureAvailability: (keys) =>
            featureFlippingFails && Array.isArray(keys)
              ? _$q_.reject(new Error('unreachable'))
              : _$q_.resolve({
                  isFeatureAvailable: (feature) => features.includes(feature),
                }),
        }));
        $provide.factory('dedicatedCloudDatacenterBackupService', (_$q_) => ({
          getBackup: () =>
            _$q_.resolve(new Backup({ state: backupState, backupOffer })),
          getBackupOffers: () => _$q_.resolve([]),
        }));
        $provide.factory('DedicatedCloud', (_$q_) => ({
          getDatacenterLicence: () => _$q_.resolve({ isSplaActive }),
          getHosts: () => _$q_.resolve(new Array(hostCount).fill({})),
        }));
        $provide.factory('ovhPaymentMethod', (_$q_) => ({
          getDefaultPaymentMethod: () => _$q_.resolve(null),
        }));
      });

      angular.mock.inject((_$state_, _$rootScope_, $transitions) => {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $transitions.onSuccess({}, (transition) => {
          lastTransition = transition;
        });
      });
    });
  };

  const go = (state) => {
    $state.go(state, { productId: 'pcc-1', datacenterId: '1' });
    $rootScope.$digest();
    return $state.current.name;
  };

  const resolved = (token) => lastTransition.injector().get(token);

  describe('normal account, MBV open, datacenter without backup', () => {
    setup({ features: MBV_OPEN });

    it('stays on the Backup tab instead of the activation page', () => {
      expect(go(BACKUP_STATE)).toBe(BACKUP_STATE);
      expect(resolved('isOrderBlockedByManagedBackupForVmware')).toBe(true);
      expect(resolved('managedBackupForVmwareUrl')).toBe(
        '/beta/#/private-cloud/managed-backup-for-vmware',
      );
    });

    it.each(['new', 'spla-licence', 'minimum-hosts'])(
      'sends a direct URL to %s back to the Backup tab',
      (subState) => {
        expect(go(`${BACKUP_STATE}.${subState}`)).toBe(BACKUP_STATE);
      },
    );
  });

  describe('normal account, MBV open, datacenter without SPLA licence', () => {
    setup({ features: MBV_OPEN, isSplaActive: false });

    it('shows the Backup tab rather than the licence prerequisite', () => {
      expect(go(BACKUP_STATE)).toBe(BACKUP_STATE);
    });
  });

  describe('normal account, MBV closed, datacenter without backup', () => {
    setup({ features: [CAN_ORDER_BACKUP_FEATURE] });

    it('still opens the activation page', () => {
      expect(go(BACKUP_STATE)).toBe(`${BACKUP_STATE}.new`);
    });
  });

  describe('trusted account, MBV container on but container-snc off', () => {
    setup({ isTrusted: true, features: MBV_OPEN });

    it('still opens the activation page', () => {
      expect(go(BACKUP_STATE)).toBe(`${BACKUP_STATE}.new`);
    });
  });

  describe('trusted account, MBV container and container-snc on', () => {
    setup({
      isTrusted: true,
      features: [...MBV_OPEN, MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE],
    });

    it('stays on the Backup tab', () => {
      expect(go(BACKUP_STATE)).toBe(BACKUP_STATE);
    });
  });

  describe('feature flipping unreachable', () => {
    setup({ features: MBV_OPEN, featureFlippingFails: true });

    it('keeps the current behaviour and opens the activation page', () => {
      expect(go(BACKUP_STATE)).toBe(`${BACKUP_STATE}.new`);
      expect(resolved('canOrderBackup')).toBe(true);
    });
  });

  describe('existing customer, MBV open', () => {
    setup({ features: MBV_OPEN, backupState: BACKUP_STATE_ENABLED });

    it('shows the Backup tab, not blocked by MBV, offer change still bound to canOrderBackup alone', () => {
      expect(go(BACKUP_STATE)).toBe(BACKUP_STATE);
      expect(resolved('isOrderBlockedByManagedBackupForVmware')).toBe(false);
      expect(resolved('canOrderBackup')).toBe(true);
    });
  });

  describe('existing customer on the legacy offer, MBV open', () => {
    setup({
      features: MBV_OPEN,
      backupState: BACKUP_STATE_ENABLED,
      backupOffer: 'legacy',
    });

    it('still reaches the page to move to a new offer', () => {
      expect(go(BACKUP_STATE)).toBe(`${BACKUP_STATE}.new`);
    });
  });
});
