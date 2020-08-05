angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.answer.voicemailPassword',
      {
        url: '/voicemailPassword',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/answer/voicemailPassword/telecom-telephony-line-answer-voicemailPassword.html',
            noTranslations: true,
          },
          'voicemailView@telecom.telephony.billingAccount.line.dashboard.answer.voicemailPassword': {
            templateUrl:
              'app/telecom/telephony/service/voicemail/password/telecom-telephony-service-voicemail-password.html',
            controller: 'TelecomTelephonyServiceVoicemailPasswordCtrl',
            controllerAs: 'VoicemailPasswordCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_answer_actions_line_voicemail_password_breadcrumb',
            ),
        },
        translations: {
          value: ['..', '../../../service/voicemail/password'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
