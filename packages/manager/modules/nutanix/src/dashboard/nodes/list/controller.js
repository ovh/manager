import {
  MAX_NODES_BY_CLUSTER,
  NODE_STATUS,
  SERVICE_STATES,
} from '../../../constants';

export default class NutanixAllNodesCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.nodesMapped = [];
    this.SERVICE_STATES = SERVICE_STATES;
  }

  $onInit() {
    this.hasOnlyMinimumNode = true;
    const uniqueStates = [
      ...new Set(this.nodes.map(({ serviceStatus }) => serviceStatus)),
    ];
    this.mapAllNodes();

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

    this.hasErrorInstall = this.nodes.some(
      (node) => node.status === NODE_STATUS.DEPLOY_FAILURE,
    );
    this.hasErrorUninstall = this.nodes.some(
      (node) => node.status === NODE_STATUS.UNDEPLOY_FAILURE,
    );
  }

  static getNodeDetailsState(nodeId) {
    return `nutanix.dashboard.nodes.node.general-info({ nodeId: '${nodeId}'})`;
  }

  mapAllNodes() {
    this.nodesMapped = this.nodes.map((node) =>
      node.displayName !== null
        ? node
        : {
            ...node,
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

    this.hasOnlyMinimumNode =
      this.nodesMapped.filter(
        (node) => node.serviceStatus === SERVICE_STATES.ACTIVE,
      ).length <= this.cluster.targetSpec.metadata.initialCommitmentSize;
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
