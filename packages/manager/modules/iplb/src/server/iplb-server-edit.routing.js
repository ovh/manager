export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('network.iplb.detail.server-farm.server-update', {
    url: '/:farmId/server/:serverId',
    params: {
      farmId: null,
      serverId: null,
    },
    views: {
      iplbFarms: {
        component: 'ovhManagerIplbServerEdit',
      },
    },
    resolve: {
      farmId: /* @ngInject */ ($transition$) => $transition$.params().farmId,
      serverId: /* @ngInject */ ($transition$) => $transition$.params().serverId,
    },
  })
    .state('network.iplb.detail.server-farm.server-add', {
      url: '/:farmId/server/add',
      params: {
        farmId: null,
      },
      views: {
        iplbFarms: {
          component: 'ovhManagerIplbServerEdit',
        },
      },
      resolve: {
        farmId: /* @ngInject */ ($transition$) => $transition$.params().farmId,
      },
    });
};
