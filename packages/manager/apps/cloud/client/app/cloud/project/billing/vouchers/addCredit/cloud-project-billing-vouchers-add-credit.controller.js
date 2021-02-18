class CloudProjectBillingVouchersAddcreditCtrl {
  constructor($uibModalInstance, CucControllerHelper, OvhApiMe) {
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiMe = OvhApiMe;
    this.credit = {
      amount: 10,
    };

    this.currency = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.OvhApiMe.v6().get().$promise,
    });
  }

  $onInit() {
    this.currency.load();
  }

  addCredit() {
    this.$uibModalInstance.close(this.credit.amount);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingVouchersAddcreditCtrl',
    CloudProjectBillingVouchersAddcreditCtrl,
  );
