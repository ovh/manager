export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores.resourceUpgrade',
    {
      url: '/upgradeResource',
      params: {
        id: null,
        type: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPccResourceUpgrade',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        id: /* @ngInject */ ($transition$) => $transition$.params().id,
        type: /* @ngInject */ ($transition$) => $transition$.params().type,
        breadcrumb: () => null,
      },
    },
  );
};
