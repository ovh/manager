angular.module('Billing.controllers').controller('billingControllersAutoRenewWarnNicBillingCtrl', class {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.service = this.$scope.currentActionData;
  }

  close() {
    this.$scope.setAction();
  }
});
