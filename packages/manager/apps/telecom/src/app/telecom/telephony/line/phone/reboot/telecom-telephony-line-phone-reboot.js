angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.reboot',
    {
      url: '/reboot',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/phone/reboot/telecom-telephony-line-phone-reboot.html',
          controller: 'TelecomTelephonyLinePhoneRebootCtrl',
          controllerAs: 'PhoneRebootCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
