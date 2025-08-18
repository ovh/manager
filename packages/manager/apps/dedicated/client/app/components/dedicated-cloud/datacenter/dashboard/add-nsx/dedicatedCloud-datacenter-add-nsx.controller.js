import { NSX_RESOURCES } from '../../../datacenters/datacenter.constants';
import { DATACENTER_NETWORK_SITE_WEB_LINK } from '../../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants.js';
import { TRACKING_ACTION_PREFIX } from './constants.js';

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
    this.DedicatedCloudDatacenterNetwork = DedicatedCloudDatacenterNetwork;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.NSX_RESOURCES = NSX_RESOURCES;
    this.vcpuTextPrice = '-';
  }

  $onInit() {
    this.loading = false;
    this.selectedNsxLevel = null;

    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.guideUrl =
      DATACENTER_NETWORK_SITE_WEB_LINK[ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;

    this.fetchVcpuTextPrice(ovhSubsidiary);
  }

  fetchVcpuTextPrice() {
    this.DedicatedCloudDatacenterNetwork.fetchVcpuTextPrice(
      this.productId,
    ).then((vcpuTextPrice) => {
      this.vcpuTextPrice = vcpuTextPrice;
    });
  }

  handleAddNsx() {
    this.loading = true;
    this.trackActionConfirm();
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

  trackActionConfirm() {
    this.trackAction(`order_nsx-edge-nodes::confirm::${this.selectedNsxLevel}`);
  }

  trackAction(hit) {
    this.trackClick(
      `${TRACKING_ACTION_PREFIX}${hit}`,
      `${TRACKING_ACTION_PREFIX}'add_nsx-edge-nodes'`,
    );
  }
}
