export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.service-integration.delete',
    {
      url: '/delete',
      params: {
        integration: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseServiceIntegrationDeleteComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToServiceIntegration) =>
          goBackToServiceIntegration,
        integration: /* @ngInject */ ($transition$) =>
          $transition$.params().integration,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
