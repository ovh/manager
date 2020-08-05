angular
  .module('managerApp')
  .config(($stateProvider) => {
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
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_phone_codec_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
