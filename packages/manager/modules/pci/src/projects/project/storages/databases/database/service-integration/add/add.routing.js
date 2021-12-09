export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.service-integration.add',
    {
      url: '/add',
      views: {
        modal: {
          component:
            'ovhManagerPciStoragesDatabaseServiceIntegrationAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToServiceIntegration) =>
          goBackToServiceIntegration,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
