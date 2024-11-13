export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.dashboard.associate-ip-bloc',
    {
      url: '/associate-ip-bloc',
      redirectTo: (transition) => {
        return transition
          .injector()
          .getAsync('hasVCDMigration')
          .then((hasVCDMigration) =>
            hasVCDMigration
              ? 'app.dedicatedCloud.details.dashboard-light.associate-ip-bloc'
              : false,
          );
      },
      params: {
        ips: null,
      },
      views: {
        modal: {
          component: 'ovhManagerDedicatedMoveIp',
        },
      },
      layout: 'modal',
      resolve: {
        ips: /* @ngInject */ (currentService) =>
          currentService.ips?.map((ip) => ip.network),
        goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
        trackingPrefix: () =>
          'dedicated::dedicatedClouds::dashboard::associate-ip-bloc',
        breadcrumb: () => null,
      },
    },
  );
};
