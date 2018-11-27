angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.options', {
    url: '/options',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/options/telecom-sms-options.html',
        controller: 'TelecomSmsOptionsCtrl',
        controllerAs: 'TelecomSmsOptionsCtrl',
      },
    },
    translations: ['.'],
  });
});
