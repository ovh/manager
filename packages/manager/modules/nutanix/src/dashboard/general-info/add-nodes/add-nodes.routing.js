import { NUTANIX_MULTIPLE_NODES_ORDER_FEATURE } from '../../constants';
import NodeExpressOrderLinkGenerator from '../../node-express-order-link-generator';
import { ENTERPRISE_SOLUTIONS_LEVEL_2_CODE } from '../../../constants';
import { TRACKING } from '../constants';

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
          nodeServicesDetails,
          server.availabilityZone,
        ),
      handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.info(message, 'nutanix_dashboard_alert');
        goBack();
      },
      isMultipleNodesOrderEnabled: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(NUTANIX_MULTIPLE_NODES_ORDER_FEATURE)
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              NUTANIX_MULTIPLE_NODES_ORDER_FEATURE,
            ),
          ),
      trackClick: /* @ngInject */ (atInternet) => (options) => {
        atInternet.trackClick({
          page: {
            name: TRACKING.DASHBOARD_ADD_NODE,
          },
          type: 'action',
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
          ...options,
        });
      },
    },
    atInternet: {
      rename: TRACKING.DASHBOARD_ADD_NODE,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    },
  });
};
