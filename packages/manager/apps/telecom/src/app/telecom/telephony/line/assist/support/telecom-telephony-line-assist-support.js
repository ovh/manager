angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.support', {
    url: '/support',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/service/assist/support/telecom-telephony-service-assist-support.html',
        controller: 'TelecomTelephonyServiceAssistSupportCtrl',
        controllerAs: 'SupportCtrl',
      },
    },
    translations: { value: ['../../../service/assist/support'], format: 'json' },
  });
});
