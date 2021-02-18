angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.consumption.current', {
    url: '/current',
    views: {
      cloudProjectBillingConsumption: {
        templateUrl:
          'app/cloud/project/billing/consumption/current/cloud-project-billing-consumption-current.html',
        controller: 'CloudProjectBillingConsumptionCurrentCtrl',
        controllerAs: 'BillingConsumptionCurrentCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
