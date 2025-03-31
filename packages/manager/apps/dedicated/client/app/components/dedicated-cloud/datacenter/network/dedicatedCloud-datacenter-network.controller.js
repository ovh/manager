import {
  NETWORK_LABEL,
  MIN_NSX_EDGES,
  DATACENTER_NETWORK_SITE_WEB_LINK,
} from '../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

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
}
