export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.network.delete-nsx',
    {
      url: '/delete-nsx/:nsxtEdgeId',
      views: {
        modal: {
          component: 'ovhManagerDedicatedCloudDatacenterNetworkDeleteNsx',
        },
      },
      layout: 'modal',
      resolve: {
        nsxtEdgeId: /* @ngInject */ ($transition$) =>
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
        removeNsxtEdge: /* @ngInject */ (
          ovhManagerPccDatacenterService,
          serviceName,
          datacenterId,
          nsxtEdgeId,
        ) => () =>
          ovhManagerPccDatacenterService.removeNsxtEdge({
            serviceName,
            datacenterId,
            nsxtEdgeId,
          }),
      },
    },
  );
};
