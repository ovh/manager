angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.compose', {
    url: '/compose',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/sms/compose/telecom-sms-sms-compose.html',
        controller: 'TelecomSmsSmsComposeCtrl',
        controllerAs: 'SmsComposeCtrl',
      },
    },
    translations: ['../../../sms/dashboard', '.'],
  });
});
