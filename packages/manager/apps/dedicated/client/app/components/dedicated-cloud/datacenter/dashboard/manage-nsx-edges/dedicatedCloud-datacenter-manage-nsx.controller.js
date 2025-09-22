import { DATACENTER_NETWORK_SITE_WEB_LINK } from '../../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';

import {
  TRACKING_SUFFIX,
  TRACKING_ACTION_PREFIX,
  TRACKING_DISPLAY_PREFIX,
  TRACKING_EDIT_NSX,
} from './dedicatedCloud-datacenter-manage-nsx.constants';

import {
  EDGES_SIZES,
  NSX_RESOURCES,
} from '../../../datacenters/datacenter.constants';

export default class {
  /* @ngInject */
  constructor(
    coreConfig,
    DedicatedCloud,
    DedicatedCloudDatacenterNetwork,
    $translate,
    coreURLBuilder,
  ) {
    this.coreConfig = coreConfig;
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.NSX_RESOURCES = NSX_RESOURCES;
    this.TRACKING_SUFFIX = TRACKING_SUFFIX;
    this.DedicatedCloudDatacenterNetwork = DedicatedCloudDatacenterNetwork;
    this.vcpuTextPrice = '-';
  }

  $onInit() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.fetchVcpuTextPrice();

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
    this.loading = true;
    this.trackActionConfirm();
    this.DedicatedCloud.resizeNsxtEdgeCluster(
      this.serviceName,
      this.datacenterId,
      this.selectedNsxLevel,
    )
      .then(() => {
        this.trackPage(this.TRACKING_SUFFIX.CONFIRM_SUCCESS); // TODO does not respect anymore nomenclature MANAGER-19493
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
        this.trackPage(this.TRACKING_SUFFIX.CONFIRM_ERROR); // TODO does not respect anymore nomenclature MANAGER-19493
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchVcpuTextPrice() {
    this.DedicatedCloudDatacenterNetwork.fetchVcpuTextPrice(
      this.productId,
    ).then((vcpuTextPrice) => {
      this.vcpuTextPrice = vcpuTextPrice;
    });
  }

  trackActionConfirm() {
    this.trackAction(`${TRACKING_EDIT_NSX}::confirm::${this.selectedNsxLevel}`);
  }

  trackAction(hit) {
    this.trackClick(
      `${TRACKING_ACTION_PREFIX}${hit}`,
      `${TRACKING_DISPLAY_PREFIX}${TRACKING_EDIT_NSX}`,
    );
  }
}
