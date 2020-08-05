angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.fax.convertToVoicefax',
      {
        url: '/convertToVoicefax',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/fax/fax/convertToVoicefax/telecom-telephony-fax-fax-convertToVoicefax.html',
            noTranslations: true,
            controller: 'TelecomTelephonyFaxFaxConvertToVoiceFaxCtrl',
            controllerAs: '$ctrl',
          },
          'faxConvertToVoicefaxView@telecom.telephony.billingAccount.fax.dashboard.fax.convertToVoicefax': {
            templateUrl:
              'app/telecom/telephony/service/fax/convertToVoicefax/telecom-telephony-service-fax-convertToVoicefax.html',
            controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_fax_fax_convert_to_voice_fax_breadcrumb',
            ),
        },
        translations: {
          value: ['../../../service/fax/convertToVoicefax'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
