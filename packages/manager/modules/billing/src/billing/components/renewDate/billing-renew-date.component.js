import template from './billing-renew-date.html';

class controller {
  /* @ngInject */
  constructor(billingRenewHelper) {
    this.billingRenewHelper = billingRenewHelper;
  }

  $onInit() {
    this.content = this.billingRenewHelper.getRenewDateFormated(
      this.serviceInfos,
    );
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
