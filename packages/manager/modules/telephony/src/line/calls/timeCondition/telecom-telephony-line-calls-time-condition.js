angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.timeCondition', {
    url: '/timeCondition',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/timeCondition/telecom-telephony-line-calls-time-condition.html',
        controller: 'TelecomTelephonyLineCallsTimeConditionCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
