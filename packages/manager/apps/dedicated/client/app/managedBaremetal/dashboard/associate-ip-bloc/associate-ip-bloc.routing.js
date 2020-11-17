import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.dashboard.associate-ip-bloc', {
    url: '/associate-ip-bloc',
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
        map(currentService.ips, (ip) => ip.network),
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      trackingPrefix: () =>
        'dedicated::dedicatedClouds::dashboard::associate-ip-bloc',
    },
  });
};
