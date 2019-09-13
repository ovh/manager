angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.graph', {
      url: '/graph',
      views: {
        iplbHeader: {
          templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          templateUrl: 'app/iplb/graph/iplb-graph.html',
          controller: 'IpLoadBalancerGraphCtrl',
          controllerAs: 'ctrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
});
