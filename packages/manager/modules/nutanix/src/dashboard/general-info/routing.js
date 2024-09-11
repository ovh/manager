import { FEATURES, TRACKING, LEGACY_PACK_TYPES } from './constants';

const STATUS_DONE = 'DONE';
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info', {
    url: '',
    component: 'nutanixGeneralInfo',
    resolve: {
      trackingPrefix: /* @ngInject */ () => TRACKING.DASHBOARD,
      goToEditName: /* @ngInject */ ($state) => (nutanixClusterIamName) =>
        $state.go('nutanix.dashboard.general-info.edit-display-name', {
          nutanixClusterIamName,
        }),
      goToNutanixGeneralInfo: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
      ) => (message = false, type = STATUS_DONE, stateReload = false) => {
        const reload = (message && type === STATUS_DONE) || stateReload;
        const promise = $state.go(
          'nutanix.dashboard.general-info',
          {
            serviceName,
          },
          {
            reload,
          },
        );
        promise.then(() => {
          if (message) {
            Alerter.alertFromSWS(message, type, 'nutanix_dashboard_alert');
          }
        });
        return promise;
      },
      packType: /* @ngInject */ (clusterTechnicalDetails) =>
        clusterTechnicalDetails?.license?.edition,
      isLegacyPack: /* @ngInject */ (packType) =>
        LEGACY_PACK_TYPES.includes(packType),
      clusterAddOns: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getClusterOptions(serviceInfo.serviceId).catch(() => []),
      goToUpgradePrivateBandwidth: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.general-info.bandwidth-private-order'),
      handleError: /* @ngInject */ (Alerter) => (error) =>
        Alerter.error(
          error.message || error.data?.message,
          'nutanix_dashboard_alert',
        ),
      goToRedeploy: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.general-info.redeploy'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_general_info'),
      isPackTypeAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability([FEATURES.PACK_TYPE])
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(FEATURES.PACK_TYPE),
          )
          .catch(() => false),
      accountAuthorizations: /* @ngInject */ (NutanixService, userResources) =>
        NutanixService.checkIAMAccountAuthorizations(userResources),
    },
    atInternet: {
      rename: TRACKING.DASHBOARD,
    },
  });
};
