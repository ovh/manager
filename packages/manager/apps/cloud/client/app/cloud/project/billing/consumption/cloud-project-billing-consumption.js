angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.consumption', {
    url: '/consumption',
    views: {
      cloudProjectBilling: {
        templateUrl:
          'app/cloud/project/billing/consumption/cloud-project-billing-consumption.html',
        controller: 'CloudProjectBillingConsumptionCtrl',
        controllerAs: 'BillingConsumptionCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
