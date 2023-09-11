import { PRODUCT_LINK } from './constants';

export default class OctaviaLoadBalancerCreateCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.productPageLink =
      PRODUCT_LINK[this.user.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;

    this.model = {};
  }
}
