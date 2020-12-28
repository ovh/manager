export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.hosts.resourceUpgrade', {
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
      goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
      id: /* @ngInject */ ($transition$) => $transition$.params().id,
      type: /* @ngInject */ ($transition$) => $transition$.params().type,
    },
  });
};
