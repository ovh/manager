export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.namespaces.delete',
    {
      url: '/delete',
      params: {
        namespace: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseNamespacesDeleteComponent',
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
