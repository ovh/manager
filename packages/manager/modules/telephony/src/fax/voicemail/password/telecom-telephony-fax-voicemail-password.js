angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.voicemail.password', {
    url: '/password',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/voicemail/password/telecom-telephony-fax-voicemail-password.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.fax.voicemail.password': {
        templateUrl: 'app/telecom/telephony/service/voicemail/password/telecom-telephony-service-voicemail-password.html',
        controller: 'TelecomTelephonyServiceVoicemailPasswordCtrl',
        controllerAs: 'VoicemailPasswordCtrl',
      },
    },
    translations: ['../../../service/voicemail/password'],
  });
});
