export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.password-reset', {
    url: '/password-reset',
    params: {
      passwordPolicy: null,
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserPasswordReset',
      },
    },
    layout: 'modal',
    resolve: {
      passwordPolicy: /* @ngInject */ ($transition$) =>
        $transition$.params().passwordPolicy,
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
      breadcrumb: () => null,
    },
  });
};
