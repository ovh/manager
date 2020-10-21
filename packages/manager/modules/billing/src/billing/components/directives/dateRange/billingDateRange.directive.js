angular.module('Billing.directives').directive('billingDateRange', [
  'BILLING_BASE_URL',
  function billingDateRangeDirective(BILLING_BASE_URL) {
    return {
      restrict: 'A',
      scope: {
        onChange: '=?',
      },
      bindToController: true,
      controllerAs: '$ctrl',
      controller: 'Billing.directives.billingDateRangeCtrl',
      replace: false,
      templateUrl: `${BILLING_BASE_URL}components/directives/dateRange/billingDateRange.html`,
    };
  },
]);
