angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/abbreviatedNumbers/telecom-telephony-line-calls-abbreviatedNumbers.html',
        controller: 'TelecomTelephonyLineCallsAbbreviatedNumbersCtrl',
        controllerAs: 'LineAbbreviatedNumbersCtrl',
      },
    },
    translations: ['.'],
  });
});
