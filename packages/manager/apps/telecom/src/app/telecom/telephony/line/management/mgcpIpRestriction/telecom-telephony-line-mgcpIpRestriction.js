angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.mgcpIpRestriction',
    {
      url: '/mgcpIpRestriction',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
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
