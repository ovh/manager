angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl: 'app/telecom/telephony/billingAccount/abbreviatedNumbers/telecom-telephony-abbreviatedNumbers.html',
        controller: 'TelecomTelephonyAbbreviatedNumbersCtrl',
        controllerAs: 'AbbreviatedNumbersCtrl',
      },
    },
    translations: { value: ['.', '..'], format: 'json' },
  });
});
