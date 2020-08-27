angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.configuration',
    {
      url: '/configuration',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/phone/configuration/telecom-telephony-line-phone-configuration.html',
          controller: 'TelecomTelephonyLinePhoneConfigurationCtrl',
          controllerAs: 'PhoneConfigCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
