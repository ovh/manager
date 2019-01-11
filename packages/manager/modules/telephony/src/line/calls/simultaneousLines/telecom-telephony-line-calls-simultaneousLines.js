angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.simultaneousLines', {
    url: '/simultaneousLines',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/simultaneousLines/telecom-telephony-line-calls-simultaneousLines.html',
        controller: 'TelecomTelephonyLineCallsSimultaneousLinesCtrl',
        controllerAs: 'LineSimultaneousLinesCtrl',
      },
    },
    translations: ['.'],
  });
});
