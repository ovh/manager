import template from './convert-to-voicefax.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.convertToVoicefax',
    {
      url: '/convertToVoicefax',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxConvertToVoicefaxView@telecom.telephony.billingAccount.line.dashboard.fax.convertToVoicefax': {
          templateUrl:
            'app/telecom/telephony/service/fax/convertToVoicefax/convert-to-voicefax.html',
          controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../../../service/fax/convertToVoicefax'],
        format: 'json',
      },
    },
  );
};
