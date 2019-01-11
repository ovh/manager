angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.voicemail.options', {
    url: '/options',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/voicemail/options/telecom-telephony-fax-voicemail-options.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.fax.voicemail.options': {
        templateUrl: 'app/telecom/telephony/service/voicemail/options/telecom-telephony-service-voicemail-options.html',
        controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
        controllerAs: 'VoicemailOptionsCtrl',
      },
    },
    translations: ['../../../service/voicemail/options'],
  });
});
