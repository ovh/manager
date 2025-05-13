export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite.git-deployment', {
    url: '/git-deployment?path',
    params: {
      path: null,
    },
    layout: 'modal',
    views: {
      modal: {
        component: 'hostingMultisiteGitDeploymentComponent',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      path: /* @ngInject */ ($transition$) => $transition$.params().path,
    },
  });
};
