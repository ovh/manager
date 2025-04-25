export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.move-nsxt-edge',
    {
      url: '/move-nsxt-edge',
      views: {
        modal: {
          component: 'datacenterMoveNsxtEdgeModal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('app.dedicatedCloud.details.datacenter.details.dashboard'),
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
