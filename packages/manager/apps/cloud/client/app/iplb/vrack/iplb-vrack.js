angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.vrack', {
      url: '/vrack',
      redirectTo: 'network.iplb.detail.vrack.home',
      views: {
        iplbHeader: {
          templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          template: '<div data-ui-view="iplbVrack"><div>',
        },
      },
      translations: {
        value: ['../frontends'],
        format: 'json',
      },
    })
    .state('network.iplb.detail.vrack.home', {
      url: '/',
      views: {
        iplbVrack: {
          templateUrl: 'app/iplb/vrack/iplb-vrack.html',
          controller: 'IpLoadBalancerVrackCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../vrack'],
        format: 'json',
      },
    })
    .state('network.iplb.detail.vrack.add', {
      url: '/add',
      views: {
        iplbVrack: {
          templateUrl: 'app/iplb/vrack/iplb-vrack-edit.html',
          controller: 'IpLoadBalancerVrackEditCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../frontends'],
        format: 'json',
      },
    })
    .state('network.iplb.detail.vrack.edit', {
      url: '/:networkId',
      views: {
        iplbVrack: {
          templateUrl: 'app/iplb/vrack/iplb-vrack-edit.html',
          controller: 'IpLoadBalancerVrackEditCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../frontends'],
        format: 'json',
      },
    });
});
