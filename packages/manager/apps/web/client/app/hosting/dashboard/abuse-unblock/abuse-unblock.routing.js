export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.abuse-unblock', {
    url: '/abuse-unblock',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'hostingAbuseUnblockComponent',
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
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.task', $transition$.params()),
    },
  });
};
