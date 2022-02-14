import { TRACKING_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'anthos.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '',
    views: {
      anthosTenantView: 'anthosDashboardGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,

      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),

      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),

      packInfo: /* @ngInject */ (AnthosTenantsService, serviceInfo) =>
        AnthosTenantsService.getPackInfo(serviceInfo),

      goBack: /* @ngInject */ ($state, goToTenant) => (
        message,
        type,
        stateToGo = $state.$current.parent.name,
        stateParams = {},
      ) => goToTenant(message, type, stateToGo, stateParams),

      goToRenameService: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.general-information.rename-service', {
          serviceName,
        }),

      goToOrderStorage: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.add-storage'),

      goToOrderPublicIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-public-ip'),

      goToAssignPrivateIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.assign-private-ip'),

      goToSoftwareUpdate: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.software-update'),

      goToAccessRestriction: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.access-restriction'),

      goToUpgradePack: /* @ngInject */ ($state) => (pack) =>
        $state.go('anthos.dashboard.general-information.upgrade-pack', {
          pack,
        }),

      generalInfoHitTracking: () => {
        return 'general-information';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::general-information`,
    },
  });
};
