angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail',
    {
      url: '/voicemail',
      views: {
        faxInnerView: {
          templateUrl:
            'app/telecom/telephony/fax/voicemail/telecom-telephony-fax-voicemail.html',
          controller: 'TelecomTelephonyFaxVoicemailCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
