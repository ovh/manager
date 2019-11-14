angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.phonebook', {
    url: '/phonebook',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl: 'app/telecom/telephony/billingAccount/phonebook/telecom-telephony-billing-account-phonebook.html',
        controller: 'TelecomTelephonyBillingAccountPhonebookCtrl',
        controllerAs: 'PhonebookCtrl',
      },
    },
    translations: { value: ['.', '..'], format: 'json' },
  });
});
