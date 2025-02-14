import {
  CLUSTER_STATUS,
  NUTANIX_AUTHORIZATION_TYPE,
  MAX_NODES_BY_CLUSTER,
} from '../../constants';
import {
  GENERAL_INFO_TILE_TITLE,
  NUTANIX_PERSONAL_LICENSE_EDITION,
  PRIVATE_BANDWIDTH_SERVICE_PREFIX,
  REPLICATION_FACTOR_PREFIX,
  TRAVAUX_LINK,
  TRACKING,
  GUIDES_URL,
  NUTANIX_BYOL,
} from './constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreConfig,
    ovhManagerRegionService,
    NutanixService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK =
      TRAVAUX_LINK[coreConfig.getRegion()] || TRAVAUX_LINK.DEFAULT;
    this.coreConfig = coreConfig;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.NutanixService = NutanixService;
    this.REPLICATION_FACTOR_PREFIX = REPLICATION_FACTOR_PREFIX;
    this.NUTANIX_PERSONAL_LICENSE_EDITION = NUTANIX_PERSONAL_LICENSE_EDITION;
    this.NUTANIX_BYOL = NUTANIX_BYOL;
    this.GENERAL_INFO_TILE_TITLE = GENERAL_INFO_TILE_TITLE;
    this.nodesDetails = [];
    this.addNodeTooltipContent = null;
  }

  $onInit() {
    this.loadServicesDetails();
    this.setPrivateBandwidthServiceId();
    this.clusterRedeploying = this.cluster.status === CLUSTER_STATUS.DEPLOYING;
    this.showRedeployWarningModal = false;
    this.TRACKING = TRACKING;
    this.isMaxNodesReached = this.nodes.length >= MAX_NODES_BY_CLUSTER;
    this.addNodeTooltipContent = this.isMaxNodesReached
      ? this.$translate.instant(
          'nutanix_dashboard_cluster_add_node_max_node_tooltip',
        )
      : null;

    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.NUTANIX_LINK =
      (GUIDES_URL[ovhSubsidiary] || GUIDES_URL.DEFAULT) +
      (this.packType === this.NUTANIX_PERSONAL_LICENSE_EDITION
        ? 'byol'
        : 'packaged');
  }

  getNodeRacks() {
    return [...new Set(this.nodes.map(({ rack }) => rack))].join(' - ');
  }

  loadServicesDetails() {
    this.loadingServicesDetails = true;
    return this.NutanixService.getServicesDetails(this.serviceInfo.serviceId)
      .then((servicesDetails) => {
        this.servicesDetails = servicesDetails;
        this.getPackType();
      })
      .finally(() => {
        this.loadingServicesDetails = false;
      });
  }

  loadNodesStatus() {
    this.loadingNodesStatus = true;
    return this.NutanixService.getNodesWithState(this.serviceName)
      .then((nodesDetails) => {
        this.nodesDetails = nodesDetails;
        this.isMaxNodesReached = nodesDetails.length >= MAX_NODES_BY_CLUSTER;
        this.addNodeTooltipContent = this.isMaxNodesReached
          ? this.$translate.instant(
              'nutanix_dashboard_cluster_add_node_max_node_tooltip',
            )
          : null;
      })
      .finally(() => {
        this.loadingNodesStatus = false;
      });
  }

  get numberNodesDeployed() {
    return this.nodes.filter((node) => node.isDeployed).length;
  }

  get numberNodesToDeploy() {
    return this.nodes.filter((node) => node.isWaitForConfigure).length;
  }

  setPrivateBandwidthServiceId() {
    this.privateBandwidthServiceId = this.clusterAddOns.find((addOn) =>
      addOn.billing?.plan?.code?.startsWith(PRIVATE_BANDWIDTH_SERVICE_PREFIX),
    )?.serviceId;
  }

  trackClick(trackText) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${trackText}`,
      type: 'action',
    });
  }

  redeployCluster() {
    if (
      this.packType !== this.NUTANIX_PERSONAL_LICENSE_EDITION &&
      !this.showRedeployWarningModal
    ) {
      return this.goToRedeploy();
    }
    this.showRedeployWarningModal = true;
    return null;
  }

  onCancel() {
    this.showRedeployWarningModal = false;
  }

  haveServicesAuthorizations() {
    return this.accountAuthorizations[NUTANIX_AUTHORIZATION_TYPE.SERVICES];
  }

  haveSupportAuthorizations() {
    return this.accountAuthorizations[NUTANIX_AUTHORIZATION_TYPE.SUPPORT];
  }
}
