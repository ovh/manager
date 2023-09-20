import { PRODUCT_LINK, REGION_AVAILABILITY_LINK } from './constants';

export default class OctaviaLoadBalancerCreateCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.productPageLink =
      PRODUCT_LINK[this.user.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;

    this.regionPageLink =
      REGION_AVAILABILITY_LINK[this.user.ovhSubsidiary] ||
      REGION_AVAILABILITY_LINK.DEFAULT;

    this.model = {};

    this.stepper = {
      loadBalancerSize: { name: 'load_balancer_size', display: null },
      loadBalancerRegion: { name: 'load_balancer_region', display: null },
    };
  }

  onSizeChange(newSize) {
    this.model.size = newSize;
    this.model.region = {};
    this.regionsFilteredBySize = this.regionsPlansGroupBySize.find(
      (plan) => plan.size === newSize.code,
    ).regions;
  }

  onRegionChange(region) {
    this.model.region = region;
  }

  createLoadBalancer() {
    // TODO: REMOVE THIS LINE
    this.model.submit = true;
  }
}
