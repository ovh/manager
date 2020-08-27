angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.mgcpIpRestriction',
    {
      url: '/mgcpIpRestriction',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/mgcpIpRestriction/telecom-telephony-line-mgcpIpRestriction.html',
          controller: 'TelecomTelephonyLineMgcpIpRestrictionCtrl',
          controllerAs: 'MgcpIpRestrictionCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
