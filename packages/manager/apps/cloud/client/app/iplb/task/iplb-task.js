angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.task', {
      url: '/task',
      views: {
        iplbHeader: {
          templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          templateUrl: 'app/iplb/task/iplb-task.html',
          controller: 'IpLoadBalancerTaskCtrl',
          controllerAs: 'ctrl',
        },
      },
      translations: {
        value: ['../task'],
        format: 'json',
      },
    });
});
