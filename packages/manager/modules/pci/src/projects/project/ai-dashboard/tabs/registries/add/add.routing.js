export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.registries.add', {
    url: '/add',
    views: {
      modal: {
        component: 'pciProjectAiDashboardAddRegistryModal',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToRegistries) => goToRegistries,
      regions: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getRegions(projectId),
      breadcrumb: () => null,
    },
  });
};
