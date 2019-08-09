{
  class controller {
    constructor(billingRenewHelper) {
      this.billingRenewHelper = billingRenewHelper;
    }

    $onInit() {
      this.content = this.billingRenewHelper.getRenewDateFormated(this.serviceInfos);
    }

    $onChanges() {
      this.$onInit();
    }
  }

  angular
    .module('Billing.directives')
    .component('billingRenewDate', {
      bindings: {
        serviceInfos: '<',
      },
      controller,
      templateUrl: 'account/billing/components/renewDate/billing-renew-date.html',
    });
}
