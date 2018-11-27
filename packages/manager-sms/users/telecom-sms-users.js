angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.users', {
    url: '/users',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/users/telecom-sms-users.html',
        controller: 'TelecomSmsUsersCtrl',
        controllerAs: 'SmsUsersCtrl',
      },
    },
    translations: [
      '../../sms/users',
    ],
  });
});
