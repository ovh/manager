import { MAX_NODES_BY_CLUSTER, SERVICE_STATES } from '../../../constants';

export default class NutanixAllNodesCtrl {
  /* @ngInject */
  constructor(NutanixService, ovhManagerRegionService, $translate) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
    this.NutanixService = NutanixService;
    this.nodesMapped = [];
    this.SERVICE_STATES = SERVICE_STATES;
  }

  $onInit() {
    const uniqueStates = [
      ...new Set(this.nodes.map(({ serviceStatus }) => serviceStatus)),
    ];
    this.mapAllNodes();
    this.mapNodesStatus();

    this.isMaxNodesReached = this.nodes.length >= MAX_NODES_BY_CLUSTER;
    this.addNodeTooltipContent = this.isMaxNodesReached
      ? this.$translate.instant(
          'nutanix_dashboard_nodes_add_node_max_node_tooltip',
        )
      : null;
    this.stateColumnOptions = {
      hideOperators: true,
      values: uniqueStates.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `nutanix_dashboard_service_status_${status}`,
          ),
        }),
        {},
      ),
    };
  }

  static getNodeDetailsState(nodeId) {
    return `nutanix.dashboard.nodes.node.general-info({ nodeId: '${nodeId}'})`;
  }

  mapNodesStatus() {
    this.cluster.getNodes().forEach((nodeDetail) => {
      const nodeIndex = this.nodesMapped.findIndex(
        (node) => node.name === nodeDetail.server,
      );

      if (nodeIndex < 0) return;

      this.nodesMapped[nodeIndex] = {
        ...this.nodesMapped[nodeIndex],
        ...nodeDetail,
      };
    });
  }

  mapAllNodes() {
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

  onPowerOn(nodeName) {
    this.powerOnNode(nodeName)
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_nodes_poweron_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'nutanix_dashboard_nodes_poweron_error_banner',
          )} ${error?.data?.message}`,
        );
      });
  }
}
