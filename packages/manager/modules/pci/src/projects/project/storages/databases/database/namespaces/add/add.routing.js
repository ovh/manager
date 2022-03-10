export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.namespaces.add',
    {
      url: '/add',
      component: 'ovhManagerPciProjectDatabaseNamespacesAddComponent',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        goBack: /* @ngInject */ (goBackToNamespaces) => goBackToNamespaces,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
