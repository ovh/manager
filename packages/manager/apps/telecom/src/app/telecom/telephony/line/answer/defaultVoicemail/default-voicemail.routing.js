import template from './default-voicemail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.answer.defaultVoicemail',
    {
      url: '/defaultVoicemail',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.line.dashboard.answer.defaultVoicemail': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/default/default.html',
          controller: 'TelecomTelephonyServiceVoicemailDefaultCtrl',
          controllerAs: 'DefaultVoicemailCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_answer_default_voicemail_title'),
      },
    },
  );
};
