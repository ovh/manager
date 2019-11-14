angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.restrictions', {
    url: '/restrictions',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/restrictions/telecom-telephony-line-management-restrictions.html',
        controller: 'TelecomTelephonyLineRestrictionsCtrl',
        controllerAs: 'LineRestrictionsCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
