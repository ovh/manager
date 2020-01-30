angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.rights', {
    url: '/rights',
    views: {
      cloudProjectBilling: {
        templateUrl:
          'app/cloud/project/billing/rights/cloud-project-billing-rights.html',
        controller: 'CloudProjectBillingRightsCtrl',
        controllerAs: 'BillingRightsCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
