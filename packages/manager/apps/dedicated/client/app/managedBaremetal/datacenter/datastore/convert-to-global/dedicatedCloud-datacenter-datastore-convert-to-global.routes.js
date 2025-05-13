export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores.convertToGlobal',
    {
      url: '/convert-to-global?datastoreId&isGlobal',
      params: {
        datastoreId: null,
        isGlobal: null,
      },
      views: {
        modal: {
          component: 'ovhManagerDedicatedCloudDatacenterConvertToGlobal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        datastoreId: /* @ngInject */ ($transition$) =>
          $transition$.params().datastoreId,
        isGlobal: /* @ngInject */ ($transition$) =>
          $transition$.params().isGlobal,
        breadcrumb: () => null,
      },
    },
  );
};
