import { NODE_BADGE_STATE } from './constants';

export default class NutanixAllNodesCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService, $translate) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
    this.NODE_BADGE_STATE = NODE_BADGE_STATE;
    this.nodesMapped = [];
  }

  $onInit() {
    const uniqueStates = [...new Set(this.nodes.map(({ state }) => state))];
    this.mapNodes = this.mapAllNodes();

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

  mapAllNodes() {
    console.log({ nodes: this.nodes });
    this.nodesMapped = this.nodes.map((node) =>
      node.displayName !== null
        ? node
        : {
            isHiddenNode: true,
            iam: {
              displayName: this.$translate.instant(
                'nutanix_dashboard_nodes_list_data_hidden',
              ),
            },
            state: this.$translate.instant(
              'nutanix_dashboard_nodes_list_data_hidden',
            ),
            commercialRange: this.$translate.instant(
              'nutanix_dashboard_nodes_list_data_hidden',
            ),
            datacenter: this.$translate.instant(
              'nutanix_dashboard_nodes_list_data_hidden',
            ),
          },
    );
  }
}
