import NodeExpressOrderLinkGenerator from '../../node-express-order-link-generator';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info.add-nodes', {
    url: '/add-nodes',
    views: {
      modal: {
        component: 'addNutanixNodesModal',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      nodeTechnicalDetails: /* @ngInject */ (NutanixService, cluster) =>
        NutanixService.getNodeHardwareInfo(cluster.targetSpec.nodes[0].server),
      nodePricing: /* ngInject */ (NutanixService, server) =>
        NutanixService.getServicesTotalPrice(server.serviceId),
      nodeOrderLinkGenerator: /* @ngInject */ (serviceName, clusterAddOns) =>
        new NodeExpressOrderLinkGenerator(serviceName, clusterAddOns[0]),
      handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.info(message, 'nutanix_dashboard_alert');
        goBack();
      },
    },
  });
};
