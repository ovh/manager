angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.answer.voicemailManagement',
      {
        url: '/voicemailManagement',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/answer/voicemailManagement/telecom-telephony-line-answer-voicemailManagement.html',
            noTranslations: true,
          },
          'voicemailView@telecom.telephony.billingAccount.line.dashboard.answer.voicemailManagement': {
            templateUrl:
              'app/telecom/telephony/service/voicemail/management/telecom-telephony-service-voicemail-management.html',
            controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
            controllerAs: 'VoicemailManagementCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_answer_actions_line_voicemail_management_breadcrumb',
            ),
        },
        translations: {
          value: ['..', '../../../service/voicemail/management'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
