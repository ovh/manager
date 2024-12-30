export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores.resourceUpgradeLegacy',
    {
      url: '/upgradeResourceLegacy?datastoreId',
      params: {
        id: null,
        type: null,
        upgradeType: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPccResourceUpgradeLegacy',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToDatastore) => goBackToDatastore,
        id: /* @ngInject */ ($transition$) => $transition$.params().datastoreId,
        type: /* @ngInject */ ($transition$) => $transition$.params().type,
        upgradeType: /* @ngInject */ ($transition$) =>
          $transition$.params().upgradeType,
        breadcrumb: () => null,
      },
    },
  );
};
