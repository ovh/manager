export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedClouds.security.simultaneous-connection-update',
    {
      url: '/simultaneous-connection-update',
      params: {
        userLimitConcurrentSession: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPccSecuritySimultaneousConnectionUpdate',
        },
      },
      layout: 'modal',
      resolve: {
        userLimitConcurrentSession: /* @ngInject */ ($transition$) =>
          $transition$.params().userLimitConcurrentSession,
      },
    },
  );
};
