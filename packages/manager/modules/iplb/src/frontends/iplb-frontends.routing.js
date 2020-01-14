import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.frontends', {
      url: '/frontends',
      redirectTo: 'network.iplb.detail.frontends.home',
      views: {
        iplbHeader: {
          template: IplbHeaderTemplate,
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          template: '<div data-ui-view="iplbFrontend"><div>',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('network.iplb.detail.frontends.home'),
        serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
      },
    })
    .state('network.iplb.detail.frontends.home', {
      url: '/',
      views: {
        iplbFrontend: {
          component: 'ovhManagerIplbFrontendsComponent',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goToIplbFrontendAdd: /* @ngInject */ ($state) => () => $state.go('network.iplb.detail.frontends.add'),
        goToIplbFrontendDelete: /* @ngInject */ ($state, serviceName) => (frontend) => $state.go('network.iplb.detail.frontends.delete', { frontend, serviceName }),
        goToIplbFrontendPreview: /* @ngInject */ ($state) => (frontend) => $state.go('network.iplb.detail.frontends.preview', { frontend }),
        goToIplbFrontendUpdate: /* @ngInject */ ($state) => (frontendId) => $state.go('network.iplb.detail.frontends.update', { frontendId }),
      },
    });
};
