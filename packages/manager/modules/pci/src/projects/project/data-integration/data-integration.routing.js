export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-integration', {
    url: '/data-integration',
    component: 'ovhManagerPciProjectDataIntegration',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('workflows')
        .then((workflows) =>
          workflows.length === 0
            ? { state: 'pci.projects.project.data-integration.onboarding' }
            : { state: 'pci.projects.project.data-integration.dashboard' },
        ),
    resolve: {
      workflows: /* @ngInject */ (DataIntegrationService, projectId) =>
        DataIntegrationService.getWorkflows(projectId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_data_integration_title'),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.dashboard', {
          projectId,
        }),
      sourcesLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.sources', {
          projectId,
        }),
      destinationsLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.destinations', {
          projectId,
        }),
      cliLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.data-integration.cli', {
          projectId,
        }),
    },
  });
};
