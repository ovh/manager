angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.terminate',
    {
      url: '/terminate',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/terminate/telecom-telephony-line-management-terminate.html',
          controller: 'TelecomTelephonyLineTerminateCtrl',
          controllerAs: 'TerminateCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
