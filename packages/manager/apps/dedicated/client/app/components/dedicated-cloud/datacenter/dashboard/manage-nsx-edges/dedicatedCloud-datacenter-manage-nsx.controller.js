import {
  NSXT_EDGE_CATALOG,
  DATACENTER_NETWORK_SITE_WEB_LINK,
  NSXT_EDGE_CORE_PLAN_CODE,
  NSXT_EDGE_PRICING_MODE,
} from '../../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

import { TRACKING_SUFFIX } from './dedicatedCloud-datacenter-manage-nsx.constants';
import {
  EDGES_SIZES,
  NSX_RESOURCES,
} from '../../../datacenters/datacenter.constants';

export default class {
  /* @ngInject */
  constructor(
    coreConfig,
    DedicatedCloud,
    ovhManagerPccDatacenterService,
    $translate,
    coreURLBuilder,
  ) {
    this.coreConfig = coreConfig;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.NSX_RESOURCES = NSX_RESOURCES;
    this.TRACKING_SUFFIX = TRACKING_SUFFIX;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.vcpuTextPrice = '-';
    this.userLanguage = coreConfig.getUserLocale().replace('_', '-');
  }

  $onInit() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.fetchVcpuPrice(ovhSubsidiary);

    this.loading = false;
    this.nsxSizes = Object.keys(EDGES_SIZES);
    this.selectedNsxLevel = null;
    this.hasScalingCapabilities =
      this.nsxtEdgesScalingCapabilities.length ===
      Object.keys(EDGES_SIZES).length;

    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;
  }

  isSizeAvailable(size) {
    return this.nsxtEdgesScalingCapabilities.indexOf(size) > -1;
  }

  changeNsxSize() {
    this.trackClick(this.TRACKING_SUFFIX.CONFIRM);
    this.loading = true;
    this.DedicatedCloud.resizeNsxtEdgeCluster(
      this.serviceName,
      this.datacenterId,
      this.selectedNsxLevel,
    )
      .then(() => {
        this.trackPage(this.TRACKING_SUFFIX.CONFIRM_SUCCESS);
        this.goBack(
          this.$translate.instant('dedicatedCloud_manage_nsx_edge_success'),
        );
      })
      .catch(() => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_nsx_resize_error',
          )}`,
          'danger',
        );
        this.trackPage(this.TRACKING_SUFFIX.CONFIRM_ERROR);
      })
      .finally(() => {
        this.loading = false;
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
              pricing.description === 'Consumption',
          );
        const currency = data.locale.currencyCode;

        this.setVcpuTextPrice(price, currency);
      });
  }
}
