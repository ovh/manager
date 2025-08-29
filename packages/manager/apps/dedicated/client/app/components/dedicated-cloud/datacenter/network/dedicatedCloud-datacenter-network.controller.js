import {
  NETWORK_LABEL,
  MIN_NSX_EDGES,
  DATACENTER_NETWORK_SITE_WEB_LINK,
} from '../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';
import { TRACKING_ACTION_PREFIX } from './dedicatedCloud-datacenter-network.constants.js';

import { TRACKING_DISPLAY_LISTING_NSX_SUFFIX } from '../../../../dedicatedCloud/datacenter/network/constants.js';

export default class DedicatedCloudDatacenterNetworkTab {
  /* @ngInject */
  constructor(
    DedicatedCloud,
    $translate,
    ovhManagerPccDatacenterService,
    DedicatedCloudDatacenterNetwork,
    coreConfig,
  ) {
    this.DedicatedCloud = DedicatedCloud;
    this.DedicatedCloudDatacenterNetwork = DedicatedCloudDatacenterNetwork;
    this.coreConfig = coreConfig;
    this.$translate = $translate;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.vcpuTextPrice = '-';
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');

    this.NETWORK_LABEL = NETWORK_LABEL;
    this.MIN_NSX_EDGES = MIN_NSX_EDGES;
  }

  $onInit() {
    this.pollNsxTaskId = true;
    this.loadComsumptionOfOption();
    this.getNsxtEdgePendingTask();
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.fetchVcpuTextPrice();

    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;
  }

  fetchVcpuTextPrice() {
    this.DedicatedCloudDatacenterNetwork.fetchVcpuTextPrice(
      this.productId,
    ).then((vcpuTextPrice) => {
      this.vcpuTextPrice = vcpuTextPrice;
    });
  }

  loadComsumptionOfOption() {
    this.consumptionLoading = true;
    return this.ovhManagerPccDatacenterService
      .getConsumptionForecastByServiceId(this.nsxtEdgeOptionServiceId)
      .then((consumption) => {
        this.consumption = consumption;
      })
      .catch((error) => {
        if (error.status === 404) {
          this.consumption = { price: { value: 0 } };
        } else {
          throw error;
        }
      })
      .finally(() => {
        this.consumptionLoading = false;
      });
  }

  loadNsxtEdgeNetworks(paginationParams) {
    return this.ovhManagerPccDatacenterService.getNsxtEdgeByDatacenter(
      this.serviceName,
      this.datacenterId,
      paginationParams,
    );
  }

  pollNsxtTask(taskId) {
    this.pollNsxTaskId = taskId;
    this.DedicatedCloud.datacenterResizeNsxTaskPoller(
      this.serviceName,
      taskId,
    ).finally(() => {
      this.pollNsxTaskId = null;
    });
  }

  getNsxtEdgePendingTask() {
    return this.DedicatedCloud.getDatacenterPendingResizeNsxTask(
      this.serviceName,
      this.datacenterId,
    ).then((data) => {
      if (data?.length > 0) {
        this.pollNsxtTask(data[0].taskId);
      } else {
        this.pollNsxTaskId = null;
      }
    });
  }

  goToAddNsxEdge() {
    this.trackAction('add_nsx-edge-nodes');
    this.goToAddNsx();
  }

  goToResizeNsxEdge() {
    this.trackAction('edit_nsx-edge-nodes');
    this.goToResize();
  }

  trackAction(hit) {
    this.trackClick(
      `${TRACKING_ACTION_PREFIX}${hit}`,
      TRACKING_DISPLAY_LISTING_NSX_SUFFIX,
    );
  }
}
