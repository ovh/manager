angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.codec',
    {
      url: '/codec',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/phone/codec/telecom-telephony-line-phone-codec.html',
          controller: 'TelecomTelephonyLinePhoneCodecCtrl',
          controllerAs: 'CodecCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
