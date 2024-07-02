export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite.git-removal', {
    url: '/git-removal?path',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'hostingMultisiteGitRemovalComponent',
      },
    },
    params: {
      path: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'hosting_multisite_git_association_removal_warning_title',
        ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      path: /* @ngInject */ ($transition$) => $transition$.params().path,
    },
  });
};
