angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone.codec', {
    url: '/codec',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/codec/telecom-telephony-line-phone-codec.html',
        controller: 'TelecomTelephonyLinePhoneCodecCtrl',
        controllerAs: 'CodecCtrl',
      },
    },
    translations: ['.'],
  });
});
