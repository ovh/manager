export default class BillingRenewLabelCtrl {
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
