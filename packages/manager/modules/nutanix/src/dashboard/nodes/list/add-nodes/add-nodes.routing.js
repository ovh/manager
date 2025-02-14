import NodeExpressOrderLinkGenerator from '../../../node-express-order-link-generator';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.add-nodes', {
    url: '/add-nodes',
    views: {
      modal: {
        component: 'addNutanixNodesModal',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all'),
      nodeTechnicalDetails: /* @ngInject */ (NutanixService, cluster) =>
        NutanixService.getNodeHardwareInfo(cluster.targetSpec.nodes[0].server),
      nodeServicesDetails: /* ngInject */ (NutanixService, server) =>
        NutanixService.getAllServicesDetails(server.serviceId),
      nodePricing: /* ngInject */ (NutanixService, nodeServicesDetails) =>
        NutanixService.constructor.getServicesTotalPrice(
          nodeServicesDetails.serviceDetails,
          nodeServicesDetails.optionsDetails,
        ),
      nodeOrderLinkGenerator: /* @ngInject */ (
        serviceName,
        nodeServicesDetails,
        server,
      ) =>
        new NodeExpressOrderLinkGenerator(
          serviceName,
          nodeServicesDetails.serviceDetails,
          nodeServicesDetails.optionsDetails,
          server.availabilityZone,
        ),
      handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.info(message, 'nutanix_dashboard_alert');
        goBack();
      },
    },
  });
};
