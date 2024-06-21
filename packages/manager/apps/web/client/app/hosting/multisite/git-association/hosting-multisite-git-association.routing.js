export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.git', {
    url: '/multisite/git-association',
    component: 'hostingMultisiteGitAssociationComponent',
    resolve: {
      goBack: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.hosting.dashboard.multisite', {
          productId: $transition$.params().productId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      path: /* @ngInject */ (Hosting, serviceName) =>
        Hosting.getSelected(serviceName, true).then(
          (hosting) => hosting.displayName,
        ),
      sshKey: /* @ngInject */ (
        HostingMultisiteGitAssociationService,
        serviceName,
      ) => HostingMultisiteGitAssociationService.getSshKey(serviceName),
    },
  });
};
