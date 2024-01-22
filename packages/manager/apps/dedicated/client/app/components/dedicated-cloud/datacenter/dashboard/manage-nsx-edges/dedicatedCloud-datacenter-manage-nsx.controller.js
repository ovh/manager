import { NSX_RESOURCES } from './dedicatedCloud-datacenter-manage-nsx.constants';
import { EDGES_SIZES } from '../../../datacenters/datacenter.constants';

export default class {
  /* @ngInject */
  constructor(DedicatedCloud, $translate, coreURLBuilder) {
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.NSX_RESOURCES = NSX_RESOURCES;
  }

  $onInit() {
    this.loading = false;
    this.nsx_sizes = Object.keys(EDGES_SIZES);
    this.selectedNsxLevel = null;
    this.hasScalingCapabilities =
      this.nsxtEdgesScalingCapabilities.length ===
      Object.keys(EDGES_SIZES).length;
  }

  isSizeAvailable(size) {
    return this.nsxtEdgesScalingCapabilities.indexOf(size) > -1;
  }

  changeNsxSize() {
    this.loading = true;
    this.DedicatedCloud.resizeNsxtEdgeCluster(
      this.serviceName,
      this.datacenterId,
      this.selectedNsxLevel,
    )
      .then(() => {
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
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
