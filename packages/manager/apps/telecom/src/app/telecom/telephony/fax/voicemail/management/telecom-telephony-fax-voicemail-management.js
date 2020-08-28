angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail.management',
    {
      url: '/management',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/voicemail/management/telecom-telephony-fax-voicemail-management.html',
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.dashboard.voicemail.management': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/management/telecom-telephony-service-voicemail-management.html',
          controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
          controllerAs: 'VoicemailManagementCtrl',
        },
      },
      translations: {
        value: ['../../../service/voicemail/management'],
        format: 'json',
      },
    },
  );
});
