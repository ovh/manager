angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.defaultVoicemail', {
    url: '/defaultVoicemail',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/answer/defaultVoicemail/telecom-telephony-line-answer-defaultVoicemail.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.line.defaultVoicemail': {
        templateUrl: 'app/telecom/telephony/service/voicemail/default/telecom-telephony-service-voicemail-default.html',
        controller: 'TelecomTelephonyServiceVoicemailDefaultCtrl',
        controllerAs: 'DefaultVoicemailCtrl',
      },
    },
    translations: ['..', '../../../service/voicemail/default'],
  });
});
