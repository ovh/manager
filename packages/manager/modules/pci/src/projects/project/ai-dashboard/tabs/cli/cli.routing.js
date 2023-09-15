import { CLI_GUIDES_SECTION } from './cli.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.cli', {
    url: '/cli',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardCli',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
      regions: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getRegions(projectId),
      usersTokensLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
      cliGuides: /* @ngInject */ (AiDashboardService, projectId, coreConfig) =>
        AiDashboardService.getGuides(
          projectId,
          coreConfig
            .getUserLocale()
            .replace('_', '-')
            .toLowerCase(),
          CLI_GUIDES_SECTION,
        ),
    },
  });
};
