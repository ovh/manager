const STATUS_DONE = 'DONE';
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info', {
    url: '',
    component: 'nutanixGeneralInfo',
    resolve: {
      trackingPrefix: /* @ngInject */ () => 'hpc::nutanix::cluster::dashboard',
      goToEditName: /* @ngInject */ ($state) => (displayName) =>
        $state.go('nutanix.dashboard.general-info.edit-display-name', {
          displayName,
        }),
      goToNutanixGeneralInfo: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
      ) => (message = false, type = STATUS_DONE) => {
        const reload = message && type === STATUS_DONE;
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
      clusterAddOns: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getClusterOptions(serviceInfo.serviceId),
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
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::dashboard',
    },
  });
};
