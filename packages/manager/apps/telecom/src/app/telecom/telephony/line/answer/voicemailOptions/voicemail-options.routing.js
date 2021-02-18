import template from './voicemail-options.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.answer.voicemailOptions',
    {
      url: '/voicemailOptions',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.line.dashboard.answer.voicemailOptions': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/options/options.html',
          controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
          controllerAs: 'VoicemailOptionsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_answer_actions_line_voicemail_options_breadcrumb',
          ),
      },
    },
  );
};
