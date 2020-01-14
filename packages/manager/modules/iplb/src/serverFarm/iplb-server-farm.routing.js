import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.server-farm', {
      url: '/serverfarm',
      redirectTo: 'network.iplb.detail.server-farm.home',
      views: {
        iplbHeader: {
          template: IplbHeaderTemplate,
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          template: '<div data-ui-view="iplbFarms"><div>',
        },
      },
      resolve: {
        serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
        goBack: /* @ngInject */ ($state) => () => $state.go('network.iplb.detail.server-farm', {}, true),
      },
    })
    .state('network.iplb.detail.server-farm.home', {
      url: '',
      views: {
        iplbFarms: {
          component: 'ovhManagerIplbServerFarmComponent',
        },
      },
      resolve: {
        goToServerDelete: /* @ngInject */ ($state, serviceName) => (farm, server) => $state.go('network.iplb.detail.server-farm.home.server-delete', { serviceName, server, farm }),
        goToServerPreview: /* @ngInject */ ($state, serviceName) => (server) => $state.go('network.iplb.detail.server-farm.home.server-preview', { serviceName, server }),
        goToServerStatus: /* @ngInject */ ($state, serviceName) => (server) => $state.go('network.iplb.detail.server-farm.home.server-status', { serviceName, server }),
        goToServerAdd: /* @ngInject */ ($state, serviceName) => (server) => $state.go('network.iplb.detail.server-farm.server-add', { serviceName, server }),
        goToServerUpdate: /* @ngInject */ ($state, serviceName) => (farmId, serverId) => $state.go('network.iplb.detail.server-farm.server-update', { serviceName, farmId, serverId }),
        goToIplbServerFarmPreview: /* @ngInject */ ($state, serviceName) => (farm) => $state.go('network.iplb.detail.server-farm.home.preview', { serviceName, farm }),
        goToIplbServerFarmDelete: /* @ngInject */ ($state, serviceName) => (farm) => $state.go('network.iplb.detail.server-farm.home.delete', { serviceName, farm }),
        goToIplbServerFarmUpdate: /* @ngInject */ ($state, serviceName) => (farmId) => $state.go('network.iplb.detail.server-farm.update', { serviceName, farmId }),
      },
    });
};
