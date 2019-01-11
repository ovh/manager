angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.voicemailOptions', {
    url: '/voicemailOptions',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/answer/voicemailOptions/telecom-telephony-line-answer-voicemailOptions.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.line.voicemailOptions': {
        templateUrl: 'app/telecom/telephony/service/voicemail/options/telecom-telephony-service-voicemail-options.html',
        controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
        controllerAs: 'VoicemailOptionsCtrl',
      },
    },
    translations: ['..', '../../../service/voicemail/options'],
  });
});
