angular.module('managerApp').component('hourlyResourceList', {
  templateUrl:
    'app/cloud/components/project/billing/hourly-resource-list/billing-hourly-resource-list.component.html',
  controller: 'BillingHourlyResourceListComponentCtrl',
  bindings: {
    resources: '<',
    showSwitchToMonthlyBillingOption: '<',
    showAdditionalInstanceDetails: '<',
  },
});
