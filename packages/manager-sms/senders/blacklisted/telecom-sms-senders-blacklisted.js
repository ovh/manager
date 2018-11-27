angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders.blacklisted', {
    url: '/blacklisted',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/senders/blacklisted/telecom-sms-senders-blacklisted.html',
        controller: 'TelecomSmsSendersBlacklistedCtrl',
        controllerAs: 'SmsSendersBlacklistedCtrl',
      },
    },
    translations: ['.'],
  });
});
