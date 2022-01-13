export default class NutanixAllNodesCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService) {
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  static getNodeDetailsState(nodeId) {
    return `nutanix.dashboard.nodes.node.general-info({ nodeId: '${nodeId}'})`;
  }
}
