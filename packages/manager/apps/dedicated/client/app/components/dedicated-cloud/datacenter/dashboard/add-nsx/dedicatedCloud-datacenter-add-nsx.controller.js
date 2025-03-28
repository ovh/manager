import { NSX_RESOURCES } from '../../../datacenters/datacenter.constants';
import {
  NSXT_EDGE_CATALOG,
  DATACENTER_NETWORK_SITE_WEB_LINK,
  NSXT_EDGE_CORE_PLAN_CODE,
} from '../../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

export default class {
  /* @ngInject */
  constructor(
    $q,
    coreConfig,
    DedicatedCloud,
    ovhManagerPccDatacenterService,
    $translate,
    coreURLBuilder,
  ) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.DedicatedCloud = DedicatedCloud;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.NSX_RESOURCES = NSX_RESOURCES;
    this.vcpuTextPrice = '-';
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');
  }

  $onInit() {
    this.loading = false;
    this.selectedNsxLevel = null;

    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;

    this.fetchVcpuPrice(ovhSubsidiary);
  }

  setVcpuTextPrice(price, currency) {
    this.vcpuTextPrice = new Intl.NumberFormat(this.userLanguage, {
      style: 'currency',
      currency,
    }).format(price / 1e8);
  }

  fetchVcpuPrice(ovhSubsidiary) {
    return this.$q
      .all([
        this.ovhManagerPccDatacenterService.getOrderCatalog(
          NSXT_EDGE_CATALOG,
          ovhSubsidiary,
        ),
        this.DedicatedCloud.getVCDPricingMode(this.productId),
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

        this.setVcpuTextPrice(price, currency);
      });
  }

  handleAddNsx() {
    this.loading = true;
    this.addNsx()
      .then(() => {
        this.handleSuccess(
          this.$translate.instant('dedicatedCloud_add_nsx_success_banner'),
        );
      })
      .catch((error) => {
        console.debug({ error });
        this.handleError(
          this.$translate.instant('dedicatedCloud_add_nsx_error_banner', {
            error: error.data.message,
          }),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
