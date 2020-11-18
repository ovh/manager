export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security-options', {
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
