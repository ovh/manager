angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/calls/abbreviatedNumbers/telecom-telephony-line-calls-abbreviatedNumbers.html',
        controller: 'TelecomTelephonyLineCallsAbbreviatedNumbersCtrl',
        controllerAs: 'LineAbbreviatedNumbersCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
