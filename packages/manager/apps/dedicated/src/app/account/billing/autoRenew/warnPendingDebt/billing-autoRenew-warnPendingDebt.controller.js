angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.WarnPendingDebt', class {
  constructor($scope, $state, $timeout) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.service = this.$scope.currentActionData;
  }

  close() {
    this.$scope.setAction();
  }

  redirectToBilling() {
    const delay = 800;
    this.$scope.setAction();
    this.$timeout(() => {
      this.$state.go('app.account.billing.main.history');
    }, delay);
  }
});
