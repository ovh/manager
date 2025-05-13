export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores.resourceUpgrade',
    {
      url: '/upgradeResource?datastoreId',
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
        id: /* @ngInject */ ($transition$) => $transition$.params().datastoreId,
        type: /* @ngInject */ ($transition$) => $transition$.params().type,
        breadcrumb: () => null,
      },
    },
  );
};
