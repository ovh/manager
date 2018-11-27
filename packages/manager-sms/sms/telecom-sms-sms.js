angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms', {
    url: '/sms',
    views: {
      smsInnerView: {
        templateUrl: 'app/telecom/sms/sms/telecom-sms-sms.html',
        controller: 'TelecomSmsSmsCtrl',
        controllerAs: 'TelecomSmsSmsCtrl',
      },
    },
    translations: ['.'],
  });
});
