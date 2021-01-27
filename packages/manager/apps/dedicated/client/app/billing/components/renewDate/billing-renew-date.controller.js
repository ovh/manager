export default class BillingRenewDateCtrl {
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
