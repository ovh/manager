angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.fax.convertToVoicefax',
      {
        url: '/convertToVoicefax',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/fax/convertToVoicefax/telecom-telephony-line-fax-convertToVoicefax.html',
            noTranslations: true,
          },
          'faxConvertToVoicefaxView@telecom.telephony.billingAccount.line.dashboard.fax.convertToVoicefax': {
            templateUrl:
              'app/telecom/telephony/service/fax/convertToVoicefax/telecom-telephony-service-fax-convertToVoicefax.html',
            controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_fax_convert_to_voice_fax_breadcrumb',
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
