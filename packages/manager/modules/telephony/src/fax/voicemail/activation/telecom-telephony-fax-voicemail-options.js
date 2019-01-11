angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.voicemail.activation', {
    url: '/activation',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/voicemail/activation/telecom-telephony-fax-voicemail-activation.html',
        controller: 'TelecomTelephonyFaxVoicemailActivationCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
