import {
  NETWORK_LABEL,
  MIN_NSX_EDGES,
  NSXT_EDGE_CATALOG,
  DATACENTER_NETWORK_SITE_WEB_LINK,
  NSXT_EDGE_CORE_PLAN_CODE,
  NSXT_EDGE_PRICING_MODE,
} from '../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

export default class DedicatedCloudDatacenterNetworkTab {
  /* @ngInject */
  constructor($translate, ovhManagerPccDatacenterService, coreConfig) {
    this.coreConfig = coreConfig;
    this.$translate = $translate;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.vcpuTextPrice = '-';
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');

    this.NETWORK_LABEL = NETWORK_LABEL;
    this.MIN_NSX_EDGES = MIN_NSX_EDGES;
  }

  $onInit() {
    this.loadComsumptionOfOption();
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.fetchVcpuPrice(ovhSubsidiary);

    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;
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

  setVcpuTextPrice(price, currency) {
    this.vcpuTextPrice = new Intl.NumberFormat(this.userLanguage, {
      style: 'currency',
      currency,
    }).format(price / 1e8);
  }

  fetchVcpuPrice(ovhSubsidiary) {
    this.ovhManagerPccDatacenterService
      .getOrderCatalog(NSXT_EDGE_CATALOG, ovhSubsidiary)
      .then((data) => {
        const { price } = data.addons
          .find((addon) => addon.planCode === NSXT_EDGE_CORE_PLAN_CODE)
          .pricings.find(
            (pricing) =>
              pricing.mode === NSXT_EDGE_PRICING_MODE &&
              pricing.description === 'extra edges',
          );
        const currency = data.locale.currencyCode;

        this.setVcpuTextPrice(price, currency);
      });
  }
}
