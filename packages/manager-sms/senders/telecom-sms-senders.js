angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders', {
    url: '/senders',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/senders/telecom-sms-senders.html',
        controller: 'TelecomSmsSendersCtrl',
        controllerAs: 'SmsSendersCtrl',
      },
    },
    translations: ['.', './add'],
  });
});
