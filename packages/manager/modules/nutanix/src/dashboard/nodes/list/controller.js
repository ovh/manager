import { NODE_BADGE_STATE } from './constants';

export default class NutanixAllNodesCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService, $translate) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
    this.NODE_BADGE_STATE = NODE_BADGE_STATE;
  }

  $onInit() {
    const uniqueStates = [...new Set(this.nodes.map(({ state }) => state))];

    this.stateColumnOptions = {
      hideOperators: true,
      values: uniqueStates.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `nutanix_dashboard_nodes_list_status_${status}`,
          ),
        }),
        {},
      ),
    };
  }

  static getNodeDetailsState(nodeId) {
    return `nutanix.dashboard.nodes.node.general-info({ nodeId: '${nodeId}'})`;
  }
}
