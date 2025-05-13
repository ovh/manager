export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.security.session-timeout-update',
    {
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
        breadcrumb: () => null,
      },
    },
  );
};
