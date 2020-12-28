export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.dashboard.security-options', {
    url: '/security-options',
    params: {
      optionName: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccSecurityOptions',
      },
    },
    layout: 'modal',
    resolve: {
      optionName: /* @ngInject */ ($transition$) =>
        $transition$.params().optionName,
    },
  });
};
