import template from './convert-to-voice-fax.html';
import controller from './convert-to-voice-fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.fax.convertToVoicefax',
    {
      url: '/convertToVoicefax',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          controller,
          controllerAs: '$ctrl',
          noTranslations: true,
        },
        'faxConvertToVoicefaxView@telecom.telephony.billingAccount.fax.fax.convertToVoicefax': {
          templateUrl:
            'app/telecom/telephony/service/fax/convertToVoicefax/convert-to-voicefax.html',
          controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
