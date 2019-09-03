angular.module('Billing.controllers').controller('billingControllersAutoRenewWarnPaymentMeanCtrl', class {
  constructor($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;
  }

  close() {
    this.$scope.setAction();
  }

  goToAddPaymentMean() {
    this.$state.go('app.account.billing.payment.method').then(() => this.$scope.setAction());
  }
});
