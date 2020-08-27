angular.module('managerApp').config(($stateProvider) => {
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
      translations: {
        value: ['..', '../../../service/voicemail/password'],
        format: 'json',
      },
    },
  );
});
