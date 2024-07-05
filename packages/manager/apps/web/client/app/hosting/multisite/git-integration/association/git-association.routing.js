import { GITHUB_VCS } from './git-association.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite.git-association', {
    url: '/git-association?path',
    views: {
      '@app.hosting.dashboard': {
        component: 'hostingMultisiteGitAssociationComponent',
      },
    },
    params: {
      path: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite_git_association_title'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      status: /* @ngInject */ ($transition$) => $transition$.params().status,
      path: /* @ngInject */ ($transition$) => $transition$.params().path,
      sshKey: /* @ngInject */ (
        HostingMultisiteGitAssociationService,
        serviceName,
      ) => HostingMultisiteGitAssociationService.getSshKey(serviceName),
      webHookUrl: /* @ngInject */ (
        HostingMultisiteGitAssociationService,
        serviceName,
        path,
      ) =>
        HostingMultisiteGitAssociationService.getVcsWebhookUrls(
          serviceName,
          path,
          GITHUB_VCS,
        ).then(({ push }) => push),
    },
  });
};
