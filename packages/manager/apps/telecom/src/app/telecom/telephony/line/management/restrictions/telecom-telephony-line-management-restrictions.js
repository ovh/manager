angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.restrictions',
    {
      url: '/restrictions',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/restrictions/telecom-telephony-line-management-restrictions.html',
          controller: 'TelecomTelephonyLineRestrictionsCtrl',
          controllerAs: 'LineRestrictionsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
