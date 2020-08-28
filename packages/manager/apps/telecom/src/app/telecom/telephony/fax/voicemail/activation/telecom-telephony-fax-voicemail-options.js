angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail.activation',
    {
      url: '/activation',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/voicemail/activation/telecom-telephony-fax-voicemail-activation.html',
          controller: 'TelecomTelephonyFaxVoicemailActivationCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
