export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security.update', {
    url: '/update',
    params: {
      policy: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccSecurityUpdate',
      },
    },
    layout: 'modal',
    resolve: {
      policy: /* @ngInject */ ($transition$) => $transition$.params().policy,
    },
  });
};
