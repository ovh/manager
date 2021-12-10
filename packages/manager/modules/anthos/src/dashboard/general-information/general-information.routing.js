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

      goBack: /* @ngInject */ ($state, goToTenant) => (message, type) =>
        goToTenant(message, type, $state.$current.parent.name),

      goToRenameService: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.general-information.rename-service', {
          serviceName,
        }),

      goToOrderHost: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-host'),

      goToOrderStorage: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.add-storage'),

      goToOrderPublicIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-public-ip'),

      goToAssignPrivateIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.assign-private-ip'),

      goToSoftwareUpdate: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.software-update'),

      generalInfoHitTracking: () => {
        return 'general-information';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::general-information`,
    },
  });
};
