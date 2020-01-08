angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    /**
     * Onboarding of Cloud
     * #/cloud/offer (see "add" folder)
     */

    .state('iaas.pci-project-onboarding', {
      url: '/pci/offer?voucher',
      templateUrl: 'app/cloud/offer/cloud-offer.html',
      controller: 'CloudOfferCtrl',
      controllerAs: 'CloudOfferCtrl',
      translations: {
        format: 'json',
        value: ['../project/add', '.'],
      },
    });
});
