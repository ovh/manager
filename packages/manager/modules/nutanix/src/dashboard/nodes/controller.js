export default class NutanixDashboardCtrl {
  static getNodeDetailsState(nodeId) {
    return `nutanix.dashboard.nodes.node.general-info({ nodeId: '${nodeId}'})`;
  }
}
