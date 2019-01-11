angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls', {
    url: '/calls',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/telecom-telephony-line-calls.html',
        controller: 'TelecomTelephonyLineCallsCtrl',
        controllerAs: 'LineCallsCtrl',
      },
    },
    translations: ['.'],
  });
});
