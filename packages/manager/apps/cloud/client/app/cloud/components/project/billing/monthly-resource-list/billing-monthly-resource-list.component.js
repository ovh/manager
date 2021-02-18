angular.module('managerApp').component('monthlyResourceList', {
  templateUrl:
    'app/cloud/components/project/billing/monthly-resource-list/billing-monthly-resource-list.component.html',
  controller: 'BillingMonthlyResourceListComponentCtrl',
  bindings: {
    resources: '<',
  },
});
