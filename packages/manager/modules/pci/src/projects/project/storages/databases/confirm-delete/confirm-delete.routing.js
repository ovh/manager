export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.confirm-delete',
    {
      url: '/confirm-delete',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseConfirmDelete',
        },
      },
      params: {
        database: null,
        linkedServices: [],
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        database: /* @ngInject */ ($transition$) =>
          $transition$.params().database,
        linkedServices: /* @ngInject */ ($transition$) =>
          $transition$.params().linkedServices,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
