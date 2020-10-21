import template from './billing-renew-label.html';

class controller {
  /* @ngInject */
  constructor(billingRenewHelper) {
    this.billingRenewHelper = billingRenewHelper;
  }

  $onInit() {
    this.content = this.billingRenewHelper.getRenewLabel(this.serviceInfos);
  }

  $onChanges() {
    this.$onInit();
  }
}

export default /* @ngInject */ {
  bindings: {
    serviceInfos: '<',
  },
  controller,
  template,
};
