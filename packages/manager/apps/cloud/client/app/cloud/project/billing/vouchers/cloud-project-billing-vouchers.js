angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.billing.vouchers', {
    url: '/vouchers',
    views: {
      cloudProjectBilling: {
        templateUrl:
          'app/cloud/project/billing/vouchers/cloud-project-billing-vouchers.html',
        controller: 'CloudprojectbillingvouchersCtrl',
        controllerAs: 'VouchersCtrl',
      },
    },
    translations: {
      value: ['.', './addCredit'],
      format: 'json',
    },
  });
});
