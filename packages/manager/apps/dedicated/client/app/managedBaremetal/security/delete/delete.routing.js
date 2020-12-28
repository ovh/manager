export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.delete', {
    url: '/delete',
    params: {
      policies: null,
      selectedPolicies: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccSecurityDelete',
      },
    },
    layout: 'modal',
    resolve: {
      policies: /* @ngInject */ ($transition$) =>
        $transition$.params().policies,
      selectedPolicies: /* @ngInject */ ($transition$) =>
        $transition$.params().selectedPolicies,
    },
  });
};
