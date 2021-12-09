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
        $state.go('anthos.dashboard'),

      generalInfoHitTracking: () => {
        return 'general-information';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::general-information`,
    },
  });
};
