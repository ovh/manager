import { countAiItems } from '../ai-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.onboarding', {
    url: '/onboarding',
    component: 'pciProjectAiDashboardOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('aiItems')
        .then((items) =>
          countAiItems(items) > 0
            ? { state: 'pci.projects.project.ai-dashboard' }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
      aiGuides: /* @ngInject */ (AiDashboardService, projectId, coreConfig) =>
        AiDashboardService.getGuides(
          projectId,
          coreConfig
            .getUserLocale()
            .replace('_', '-')
            .toLowerCase(),
        ),
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
    },
  });
};
