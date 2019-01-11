angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.click2call', {
    url: '/click2call',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/click2Call/telecom-telephony-line-calls-click2Call.html',
        controller: 'TelecomTelephonyLineClick2CallCtrl',
        controllerAs: 'Click2CallCtrl',
      },
    },
    translations: ['.'],
  });
});
