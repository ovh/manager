angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing', {
    url: '/billing',
    views: {
      cloudProject: {
        templateUrl: 'app/cloud/project/billing/cloud-project-billing.html',
        controller: 'CloudProjectBillingCtrl',
        controllerAs: 'CloudProjectBillingCtrl',
      },
    },
    translations: {
      value: ['../delete', '.'],
      format: 'json',
    },
    atInternet: { ignore: true },
  });
});
