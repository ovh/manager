(() => {
  const iplbHeader = {
    templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
    controller: 'IpLoadBalancerDashboardHeaderCtrl',
    controllerAs: 'ctrl',
  };

  angular.module('managerApp').config(($stateProvider) => {
    $stateProvider
      .state('network.iplb.detail.frontends', {
        url: '/frontends',
        redirectTo: 'network.iplb.detail.frontends.home',
        views: {
          iplbHeader,
          iplbContent: {
            template: '<div data-ui-view="iplbFrontend"><div>',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.frontends.home', {
        url: '/',
        views: {
          iplbFrontend: {
            templateUrl: 'app/iplb/frontends/iplb-frontends.html',
            controller: 'IpLoadBalancerFrontendsCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.frontends.add', {
        url: '/add',
        views: {
          iplbFrontend: {
            templateUrl: 'app/iplb/frontends/iplb-frontends-edit.html',
            controller: 'IpLoadBalancerFrontendsEditCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.frontends.update', {
        url: '/:frontendId',
        views: {
          iplbFrontend: {
            templateUrl: 'app/iplb/frontends/iplb-frontends-edit.html',
            controller: 'IpLoadBalancerFrontendsEditCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });
})();
