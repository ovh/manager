export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.users-tokens.create-token',
    {
      url: '/create-token',
      views: {
        modal: {
          component: 'pciProjectAiDashboardCreateTokenModal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToUsersToken) => goBackToUsersToken,
        regions: /* @ngInject */ (AiDashboardService, projectId) =>
          AiDashboardService.getRegions(projectId),
      },
    },
  );
};
