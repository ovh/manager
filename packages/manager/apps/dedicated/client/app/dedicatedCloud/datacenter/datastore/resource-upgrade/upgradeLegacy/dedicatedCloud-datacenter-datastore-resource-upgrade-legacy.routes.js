export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedClouds.datacenter.datastores.resourceUpgradeLegacy',
    {
      url: '/upgradeResourceLegacy',
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
        id: /* @ngInject */ ($transition$) => $transition$.params().id,
        type: /* @ngInject */ ($transition$) => $transition$.params().type,
        upgradeType: /* @ngInject */ ($transition$) =>
          $transition$.params().upgradeType,
      },
    },
  );
};
