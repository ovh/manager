import { countAiItems } from './ai-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard', {
    url: '/ai-dashboard',
    component: 'ovhManagerPciProjectAiDashboard',
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
      aiItems: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAIItems(projectId),
      aiUsers: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAIUsers(projectId),
      aiTokens: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAITokens(projectId),
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
      cliLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai-dashboard.cli', {
          projectId,
        }),
    },
  });
};
