angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.phone.programmableKeys',
    {
      url: '/programmableKeys',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/phone/programmableKeys/telecom-telephony-line-phone-programmableKeys.html',
          controller: 'TelecomTelephonyLinePhoneProgammableKeysCtrl',
          controllerAs: 'ProgrammableKeysCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
