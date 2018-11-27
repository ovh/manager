angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.dashboard', {
    url: '',
    views: {
      'smsInnerView@telecom.sms': {
        templateUrl: 'app/telecom/sms/dashboard/telecom-sms-dashboard.html',
        controller: 'TelecomSmsDashboardCtrl',
        controllerAs: 'SmsDashboardCtrl',
      },
    },
    translations: ['.', '../sms/compose'],
  });
});
