export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.session-timeout-update', {
    url: '/session-timeout-update',
    params: {
      userSessionTimeout: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccSecuritySessionTimeoutUpdate',
      },
    },
    layout: 'modal',
    resolve: {
      userSessionTimeout: /* @ngInject */ ($transition$) =>
        $transition$.params().userSessionTimeout,
    },
  });
};
