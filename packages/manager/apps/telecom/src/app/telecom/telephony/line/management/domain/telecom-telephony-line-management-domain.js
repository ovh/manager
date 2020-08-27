angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.domain',
    {
      url: '/domain',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/domain/telecom-telephony-line-management-domain.html',
          controller: 'TelecomTelephonyLineDomainCtrl',
          controllerAs: 'DomainCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
