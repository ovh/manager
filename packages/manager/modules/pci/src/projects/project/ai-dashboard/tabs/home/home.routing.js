export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.home', {
    url: '/home',
    views: {
      aiDashboardTabUiView: 'pciProjectAIDashboardHome',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
    },
  });
};
