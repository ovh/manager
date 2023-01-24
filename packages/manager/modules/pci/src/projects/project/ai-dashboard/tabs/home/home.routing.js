export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.home', {
    url: '/home',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardHome',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
    },
  });
};
