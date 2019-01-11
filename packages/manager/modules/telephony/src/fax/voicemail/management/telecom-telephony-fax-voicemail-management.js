angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.voicemail.management', {
    url: '/management',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/voicemail/management/telecom-telephony-fax-voicemail-management.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.fax.voicemail.management': {
        templateUrl: 'app/telecom/telephony/service/voicemail/management/telecom-telephony-service-voicemail-management.html',
        controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
        controllerAs: 'VoicemailManagementCtrl',
      },
    },
    translations: ['../../../service/voicemail/management'],
  });
});
