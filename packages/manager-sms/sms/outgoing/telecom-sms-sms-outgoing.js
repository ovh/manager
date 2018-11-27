angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.outgoing', {
    url: '/outgoing',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/sms/outgoing/telecom-sms-sms-outgoing.html',
        controller: 'TelecomSmsSmsOutgoingCtrl',
        controllerAs: 'SmsOutgoingCtrl',
      },
    },
    translations: ['.'],
  });
});
