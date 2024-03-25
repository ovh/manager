export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('network-security.traffic', {
      url: '/traffic',
      component: 'traffic',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('network_security_dashboard_breadcrumb'),
      },
    })
    .state('network-security.traffic.ip', {
      url: '?ip&dateTime',
      component: 'traffic',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('network_security_dashboard_traffic_breadcrumb'),
      },
    });
};
