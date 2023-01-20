import { countAiItems } from './ai-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard', {
    url: '/ai-dashboard',
    component: 'ovhManagerPciProjectAIDashboard',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('aiItems')
        .then((items) =>
          countAiItems(items) === 0
            ? { state: 'pci.projects.project.ai-dashboard.onboarding' }
            : { state: 'pci.projects.project.ai-dashboard.home' },
        ),
    resolve: {
      aiItems: /* @ngInject */ (AIDashboardService, projectId) =>
        AIDashboardService.getAIItems(projectId),
      aiUsers: /* @ngInject */ (AIDashboardService, projectId) =>
        AIDashboardService.getAIUsers(projectId),
      aiTokens: /* @ngInject */ (AIDashboardService, projectId) =>
        AIDashboardService.getAITokens(projectId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_ai_dashboard_title'),
      trackingPrefix: /* @ngInject */ () =>
        'PublicCloud::pci::projects::project::ai-dashboard',
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      homeLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai-dashboard.home', {
          projectId,
        }),
      usersTokensLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
    },
  });
};
