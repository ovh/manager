angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.assist', {
    url: '/assist',
    views: {
      'lineInnerView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/assist/telecom-telephony-line-assist.html',
        controller: 'TelecomTelephonyLineAssistCtrl',
        controllerAs: 'LineAssistCtrl',
      },
    },
    translations: ['.', './troubleshooting/procedure', '../../service/assist'],
  });
});
