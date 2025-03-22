export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.network.move-nsxt-edge',
    {
      url: '/move-nsxt-edge/:nsxtEdgeId',
      views: {
        modal: {
          component: 'datacenterMoveNsxtEdgeModal',
        },
      },
      layout: 'modal',
      resolve: {
        nsxtEdgePreSelected: /* @ngInject */ ($transition$) =>
          $transition$.params().nsxtEdgeId,
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('app.dedicatedCloud.details.datacenter.details.network'),
        handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.success(message, 'dedicatedCloud_dashboard_alert');
          goBack();
        },
        handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.error(message, 'dedicatedCloud_dashboard_alert');
          goBack();
        },
        moveNsxtEdge: /* ngInject */ (
          ovhManagerPccDatacenterService,
          serviceName,
        ) => (params) =>
          ovhManagerPccDatacenterService.postRelocateNsxtEdge({
            serviceName,
            ...params,
          }),
      },
    },
  );
};
