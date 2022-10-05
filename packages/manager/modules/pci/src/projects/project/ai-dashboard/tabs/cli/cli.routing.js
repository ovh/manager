import { CLI_GUIDES_SECTION } from './cli.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.cli', {
    url: '/cli',
    views: {
      aiDashboardTabUiView: 'pciProjectAIDashboardCli',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
      usersTokensLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.ai-dashboard.users-tokens', {
          projectId,
        }),
      cliGuides: /* @ngInject */ (AIDashboardService, projectId, coreConfig) =>
        AIDashboardService.getGuides(
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
