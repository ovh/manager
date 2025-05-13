export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.home', {
    url: '/home',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardHome',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
      homeAIGuides: /* @ngInject */ (
        AiDashboardService,
        projectId,
        coreConfig,
      ) =>
        AiDashboardService.getGuides(
          projectId,
          coreConfig
            .getUserLocale()
            .replace('_', '-')
            .toLowerCase(),
        ),
      billing: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getBilling(projectId),
      goToObjectStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage', {
          projectId,
        }),
      goToAINotebooks: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.notebooks', {
          projectId,
        }),
      goToAITraining: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training', {
          projectId,
        }),
      goToAIDeploy: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai', {
          projectId,
        }),
      goToBilling: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.billing', {
          projectId,
        }),
      goToUsersAndTokens: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
    },
  });
};
