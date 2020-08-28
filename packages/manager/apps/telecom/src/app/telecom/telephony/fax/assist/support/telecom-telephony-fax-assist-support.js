angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.assist.support',
    {
      url: '/support',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/service/assist/support/telecom-telephony-service-assist-support.html',
          controller: 'TelecomTelephonyServiceAssistSupportCtrl',
          controllerAs: 'SupportCtrl',
        },
      },
      translations: {
        value: ['../../../service/assist/support'],
        format: 'json',
      },
    },
  );
});
