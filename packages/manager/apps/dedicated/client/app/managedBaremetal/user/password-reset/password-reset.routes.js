export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.users.password-reset', {
    url: '/password-reset',
    params: {
      passwordPolicy: null,
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUserPasswordReset',
      },
    },
    layout: 'modal',
    resolve: {
      passwordPolicy: /* @ngInject */ ($transition$) =>
        $transition$.params().passwordPolicy,
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
    },
  });
};
