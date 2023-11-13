export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.datastore.delete-datastore',
    {
      url: '/delete-datastore/:datastoreId',
      params: {
        datastoreId: null,
        regionId: null,
      },
      views: {
        modal: {
          component: 'pciProjectAiDashboardDeleteDatastoreModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        datastoreId: /* @ngInject */ ($transition$) =>
          $transition$.params().datastoreId,
        regionId: /* @ngInject */ ($transition$) =>
          $transition$.params().regionId,
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
      },
    },
  );
};
