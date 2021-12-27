export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai', {
    url: '/ai',
    component: 'pciProjectAi',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('isAuthorized')
        .then((isAuthorized) => {
          if (!isAuthorized) {
            return { state: 'pci.projects.project.training.onboarding' };
          }

          return { state: 'pci.projects.project.ai.apps' };
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_ai_title'),
      isAuthorized: /* @ngInject */ (PciProjectAiService, projectId) =>
        PciProjectAiService.isAuthorized(projectId),
      appsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai.apps', {
          projectId,
        }),
      tokensLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai.tokens', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      refreshState: /* @ngInject */ ($state) => () => $state.reload(),
    },
  });
};
