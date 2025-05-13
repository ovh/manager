export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.registries.delete', {
    url: '/delete/:registryId',
    views: {
      modal: {
        component: 'pciProjectAiDashboardRegistriesDeleteModal',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToRegistries) => goToRegistries,
      breadcrumb: () => null,
      registryId: /* @ngInject */ ($transition$) =>
        $transition$.params().registryId,
    },
  });
};
