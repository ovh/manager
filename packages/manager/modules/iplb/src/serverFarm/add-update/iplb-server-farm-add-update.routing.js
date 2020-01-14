export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.server-farm.add', {
      url: '/add',
      views: {
        iplbFarms: {
          component: 'iplbServerFarmAddUpdate',
        },
      },
      resolve: {
        goBackToEditPage: /* @ngInject */ ($state) => () =>
          $state.go('network.iplb.detail.server-farm.add'),
        goToServerFarmProbe: /* @ngInject */ ($state, serviceName) => (
          farm,
          edition,
        ) =>
          $state.go('network.iplb.detail.server-farm.add.probe', {
            serviceName,
            farm,
            edition,
          }),
      },
    })
    .state('network.iplb.detail.server-farm.update', {
      url: '/:farmId',
      params: {
        farmId: null,
      },
      views: {
        iplbFarms: {
          component: 'iplbServerFarmAddUpdate',
        },
      },
      resolve: {
        farmId: /* @ngInject */ ($transition$) => $transition$.params().farmId,
        goBackToEditPage: /* @ngInject */ ($state) => () =>
          $state.go('network.iplb.detail.server-farm.update'),
        goToServerFarmProbe: /* @ngInject */ ($state, serviceName) => (
          farm,
          edition,
        ) =>
          $state.go('network.iplb.detail.server-farm.update.probe', {
            serviceName,
            farm,
            edition,
          }),
      },
    });
};
