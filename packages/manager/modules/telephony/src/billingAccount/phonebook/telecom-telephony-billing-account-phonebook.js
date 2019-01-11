angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.phonebook', {
    url: '/phonebook',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/phonebook/telecom-telephony-billing-account-phonebook.html',
        controller: 'TelecomTelephonyBillingAccountPhonebookCtrl',
        controllerAs: 'PhonebookCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
