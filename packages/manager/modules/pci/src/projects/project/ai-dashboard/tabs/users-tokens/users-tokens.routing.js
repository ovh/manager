export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.users-tokens', {
    url: '/users-tokens',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardUsersTokens',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
      goBackToUsersToken: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.ai-dashboard.users-tokens';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      aiRoles: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAIRoles(projectId),
      aiTokens: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAITokens(projectId),
      goToCreateUser: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.ai-dashboard.users-tokens.create-user',
          {
            projectId,
          },
        ),

      goToCreateToken: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.ai-dashboard.users-tokens.create-token',
          {
            projectId,
          },
        ),

      goToDeleteToken: /* @ngInject */ ($state, projectId) => (token) =>
        $state.go(
          'pci.projects.project.ai-dashboard.users-tokens.delete-token',
          {
            projectId,
            tokenId: token.id,
          },
        ),
      goToManageUser: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.users', {
          projectId,
        }),
    },
  });
};
