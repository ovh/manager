angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.guides', {
    url: '/guides',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/guides/telecom-sms-guides.html',
        controller: 'TelecomSmsGuidesCtrl',
        controllerAs: 'SmsGuidesCtrl',
      },
    },
    translations: ['.'],
  });
});
