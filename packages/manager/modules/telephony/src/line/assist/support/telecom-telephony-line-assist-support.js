angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.assist.support', {
    url: '/support',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/service/assist/support/telecom-telephony-service-assist-support.html',
        controller: 'TelecomTelephonyServiceAssistSupportCtrl',
        controllerAs: 'SupportCtrl',
      },
    },
    translations: ['../../../service/assist/support'],
  });
});
