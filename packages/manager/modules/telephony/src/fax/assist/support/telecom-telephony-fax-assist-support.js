angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.assist.support', {
    url: '/support',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/service/assist/support/telecom-telephony-service-assist-support.html',
        controller: 'TelecomTelephonyServiceAssistSupportCtrl',
        controllerAs: 'SupportCtrl',
      },
    },
    translations: ['../../../service/assist/support'],
  });
});
