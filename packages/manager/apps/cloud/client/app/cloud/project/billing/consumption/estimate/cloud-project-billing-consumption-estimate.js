angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.consumption.estimate', {
    url: '/estimate',
    views: {
      cloudProjectBillingConsumption: {
        templateUrl:
          'app/cloud/project/billing/consumption/estimate/cloud-project-billing-consumption-estimate.html',
        controller: 'CloudProjectBillingConsumptionEstimateCtrl',
        controllerAs: 'BillingConsumptionEstimateCtrl',
      },
    },
    translations: {
      value: ['.', './alert/add'],
      format: 'json',
    },
  });
});
