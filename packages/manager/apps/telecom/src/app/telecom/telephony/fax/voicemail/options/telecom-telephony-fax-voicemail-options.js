angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.voicemail.options', {
    url: '/options',
    views: {
      'faxView@telecom.telephony.billingAccount.fax': {
        templateUrl: 'app/telecom/telephony/fax/voicemail/options/telecom-telephony-fax-voicemail-options.html',
        noTranslations: true,
      },
      'voicemailView@telecom.telephony.billingAccount.fax.voicemail.options': {
        templateUrl: 'app/telecom/telephony/service/voicemail/options/telecom-telephony-service-voicemail-options.html',
        controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
        controllerAs: 'VoicemailOptionsCtrl',
      },
    },
    translations: { value: ['../../../service/voicemail/options'], format: 'json' },
  });
});
