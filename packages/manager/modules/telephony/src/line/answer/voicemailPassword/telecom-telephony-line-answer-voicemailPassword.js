angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.voicemailPassword', {
    url: '/voicemailPassword',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/answer/voicemailPassword/telecom-telephony-line-answer-voicemailPassword.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.line.voicemailPassword': {
        templateUrl: 'app/telecom/telephony/service/voicemail/password/telecom-telephony-service-voicemail-password.html',
        controller: 'TelecomTelephonyServiceVoicemailPasswordCtrl',
        controllerAs: 'VoicemailPasswordCtrl',
      },
    },
    translations: ['..', '../../../service/voicemail/password'],
  });
});
