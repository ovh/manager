angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders.add', {
    url: '/add',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/senders/add/telecom-sms-senders-add.html',
        controller: 'TelecomSmsSendersAddCtrl',
        controllerAs: 'SmsSendersAddCtrl',
      },
    },
  });
});
