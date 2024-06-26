import { GITHUB_VCS } from './hosting-multisite-git-association.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.git', {
    url: '/multisite/git-association',
    component: 'hostingMultisiteGitAssociationComponent',
    params: {
      status: null,
      alertId: null,
    },
    resolve: {
      goBack: /* @ngInject */ ($transition$, $state, $timeout, setMessage) => (
        message,
        type,
      ) => {
        const promise = $state.go(
          'app.hosting.dashboard.multisite',
          {
            productId: $transition$.params().productId,
          },
          { reload: true },
        );
        if (message) {
          promise.then(() => $timeout(() => setMessage(message, type)));
        }

        return promise;
      },
      setMessage: /* @ngInject */ (
        Alerter,
        $translate,
        coreURLBuilder,
        alertId,
        serviceName,
      ) => (message, type = 'success') => {
        const params =
          type === 'error'
            ? { errorMessage: message }
            : {
                href: coreURLBuilder.buildURL(
                  'web',
                  `#/hosting/${serviceName}/task`,
                ),
              };
        return Alerter.set(
          `alert-${type}`,
          $translate.instant(
            `hosting_multisite_git_association_${type}_message`,
            params,
          ),
          message,
          alertId,
        );
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      status: /* @ngInject */ ($transition$) => $transition$.params().status,
      alertId: /* @ngInject */ ($transition$) => $transition$.params().alertId,
      path: /* @ngInject */ (Hosting, serviceName) =>
        Hosting.getSelected(serviceName, true).then(
          (hosting) => hosting.displayName,
        ),
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
