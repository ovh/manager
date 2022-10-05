export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.users-tokens', {
    url: '/users-tokens',
    views: {
      aiDashboardTabUiView: 'pciProjectAIDashboardUsersTokens',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
