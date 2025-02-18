import {
  NSXT_EDGE_CATALOG,
  DATACENTER_NETWORK_SITE_WEB_LINK,
  NSXT_EDGE_CORE_PLAN_CODE,
  NSXT_EDGE_PRICING_MODE,
} from './dedicatedCloud-datacenter-network.constants';
import { NETWORK_LABEL } from '../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

export default class DedicatedCloudDatacenterNetworkTab {
  /* @ngInject */
  constructor($translate, ovhManagerPccDatacenterService, coreConfig) {
    this.coreConfig = coreConfig;
    this.$translate = $translate;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.vcpuTextPrice = '-';
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');

    this.NETWORK_LABEL = NETWORK_LABEL;
  }

  $onInit() {
    this.fetchNsxEdgeReference();
    this.loadComsumptionOfOption();
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.fetchVcpuPrice(ovhSubsidiary);

    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.DEFAULT;
  }

  loadComsumptionOfOption() {
    this.consumptionLoading = true;
    return this.ovhManagerPccDatacenterService
      .getConsumptionForecastByServiceId(this.nsxEdgeOptionServiceId)
      .then((consumption) => {
        this.consumption = consumption;
      })
      .finally(() => {
        this.consumptionLoading = false;
      });
  }

  loadNsxEdgeNetworks(paginationParams) {
    return this.ovhManagerPccDatacenterService.getNsxEdgeByDatacenter(
      this.serviceName,
      this.datacenterId,
      paginationParams,
    );
  }

  fetchNsxEdgeReference() {
    return this.ovhManagerPccDatacenterService
      .getNsxEdgeByDatacenter(this.serviceName, this.datacenterId, {
        pageSize: 1,
      })
      .then(({ data }) => {
        this.nsxEdgeNetworkReference = data?.[0];
      });
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
