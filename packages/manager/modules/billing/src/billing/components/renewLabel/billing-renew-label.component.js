{
  class controller {
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

  angular.module('Billing.directives').component('billingRenewLabel', {
    bindings: {
      serviceInfos: '<',
    },
    controller,
    templateUrl: 'billing/components/renewLabel/billing-renew-label.html',
  });
}
