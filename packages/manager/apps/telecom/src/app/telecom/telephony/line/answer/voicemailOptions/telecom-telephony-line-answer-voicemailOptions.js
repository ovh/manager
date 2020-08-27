angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.answer.voicemailOptions',
    {
      url: '/voicemailOptions',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/answer/voicemailOptions/telecom-telephony-line-answer-voicemailOptions.html',
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.line.dashboard.answer.voicemailOptions': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/options/telecom-telephony-service-voicemail-options.html',
          controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
          controllerAs: 'VoicemailOptionsCtrl',
        },
      },
      translations: {
        value: ['..', '../../../service/voicemail/options'],
        format: 'json',
      },
    },
  );
});
