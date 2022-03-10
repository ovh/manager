export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.namespaces.edit',
    {
      url: '/edit',
      params: {
        namespace: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseNamespacesEditComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        goBack: /* @ngInject */ (goBackToNamespaces) => goBackToNamespaces,
        namespace: /* @ngInject */ ($transition$) =>
          $transition$.params().namespace,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
