angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail.options',
    {
      url: '/options',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/voicemail/options/telecom-telephony-fax-voicemail-options.html',
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.dashboard.voicemail.options': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/options/telecom-telephony-service-voicemail-options.html',
          controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
          controllerAs: 'VoicemailOptionsCtrl',
        },
      },
      translations: {
        value: ['../../../service/voicemail/options'],
        format: 'json',
      },
    },
  );
});
