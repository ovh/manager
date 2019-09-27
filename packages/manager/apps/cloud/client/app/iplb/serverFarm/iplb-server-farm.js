angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.server-farm', {
      url: '/serverfarm',
      redirectTo: 'network.iplb.detail.server-farm.home',
      views: {
        iplbHeader: {
          templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          template: '<div data-ui-view="iplbFarms"><div>',
        },
      },
      translations: {
        value: ['.', '../server'],
        format: 'json',
      },
    })
    .state('network.iplb.detail.server-farm.home', {
      url: '/',
      views: {
        iplbFarms: {
          templateUrl: 'app/iplb/serverFarm/iplb-server-farm.html',
          controller: 'IpLoadBalancerServerFarmCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('network.iplb.detail.server-farm.add', {
      url: '/add',
      views: {
        iplbFarms: {
          templateUrl: 'app/iplb/serverFarm/iplb-server-farm-edit.html',
          controller: 'IpLoadBalancerServerFarmEditCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('network.iplb.detail.server-farm.update', {
      url: '/:farmId',
      views: {
        iplbFarms: {
          templateUrl: 'app/iplb/serverFarm/iplb-server-farm-edit.html',
          controller: 'IpLoadBalancerServerFarmEditCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('network.iplb.detail.server-farm.server-add', {
      url: '/:farmId/server/add',
      views: {
        iplbFarms: {
          templateUrl: 'app/iplb/server/iplb-server-edit.html',
          controller: 'IpLoadBalancerServerEditCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('network.iplb.detail.server-farm.server-update', {
      url: '/:farmId/server/:serverId',
      views: {
        iplbFarms: {
          templateUrl: 'app/iplb/server/iplb-server-edit.html',
          controller: 'IpLoadBalancerServerEditCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
