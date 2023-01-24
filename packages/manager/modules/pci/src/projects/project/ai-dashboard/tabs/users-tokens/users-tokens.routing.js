export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.users-tokens', {
    url: '/users-tokens',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardUsersTokens',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
    },
  });
};
