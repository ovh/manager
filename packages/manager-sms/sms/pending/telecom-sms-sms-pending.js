angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.pending', {
    url: '/pending',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/sms/pending/telecom-sms-sms-pending.html',
        controller: 'TelecomSmsSmsPendingCtrl',
        controllerAs: 'SmsPendingCtrl',
      },
    },
    translations: ['.'],
  });
});
