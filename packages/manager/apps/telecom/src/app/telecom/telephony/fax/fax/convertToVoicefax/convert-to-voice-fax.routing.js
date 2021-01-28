import template from './convert-to-voice-fax.html';
import controller from './convert-to-voice-fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.fax.convertToVoicefax',
    {
      url: '/convertToVoicefax',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          controller,
          controllerAs: '$ctrl',
          noTranslations: true,
        },
        'faxConvertToVoicefaxView@telecom.telephony.billingAccount.fax.dashboard.fax.convertToVoicefax': {
          templateUrl:
            'app/telecom/telephony/service/fax/convertToVoicefax/convert-to-voicefax.html',
          controller: 'TelecomTelephonyServiceFaxConvertToVoicefaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      redirectTo: (transition) =>
        transition.params().serviceName === 'null'
          ? 'telecom.telephony.billingAccount.convertToVoicefax'
          : false,
      resolve: {
        backLink: /* @ngInject */ ($state) =>
          $state.href('telecom.telephony.billingAccount.fax.dashboard.fax'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_fax_fax_convert_to_voice_fax_breadcrumb',
          ),
      },
    },
  );
};
