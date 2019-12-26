angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.codec', {
    url: '/codec',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/line/phone/codec/telecom-telephony-line-phone-codec.html',
        controller: 'TelecomTelephonyLinePhoneCodecCtrl',
        controllerAs: 'CodecCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
