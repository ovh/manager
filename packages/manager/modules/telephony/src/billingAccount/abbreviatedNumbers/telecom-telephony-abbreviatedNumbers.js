angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/abbreviatedNumbers/telecom-telephony-abbreviatedNumbers.html',
        controller: 'TelecomTelephonyAbbreviatedNumbersCtrl',
        controllerAs: 'AbbreviatedNumbersCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
