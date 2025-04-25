import {
  NSXT_EDGE_CATALOG,
  NSXT_EDGE_CORE_PLAN_CODE,
} from '../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

const moduleName = 'ovhManagerPccDatacenterNetworkService';

class DedicatedCloudDatacenterNetworkService {
  /* @ngInject */
  constructor($q, ovhManagerPccDatacenterService, coreConfig, DedicatedCloud) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');
  }

  formatVcpuTextPrice(price, currency) {
    return new Intl.NumberFormat(this.userLanguage, {
      style: 'currency',
      currency,
    }).format(price / 1e8);
  }

  fetchVcpuTextPrice(productId) {
    return this.$q
      .all([
        this.ovhManagerPccDatacenterService.getOrderCatalog(
          NSXT_EDGE_CATALOG,
          this.ovhSubsidiary,
        ),
        this.DedicatedCloud.getVCDPricingMode(productId),
      ])
      .then(([catalogData, pricingMode]) => {
        const { price } = catalogData.addons
          .find((addon) => addon.planCode === NSXT_EDGE_CORE_PLAN_CODE)
          .pricings.find(
            (pricing) =>
              pricing.mode === pricingMode &&
              pricing.description === 'Consumption',
          );
        const currency = catalogData.locale.currencyCode;

        return this.formatVcpuTextPrice(price, currency);
      });
  }
}

angular
  .module(moduleName, [])
  .service(
    'DedicatedCloudDatacenterNetwork',
    DedicatedCloudDatacenterNetworkService,
  );

export default moduleName;
