angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.terminate.cancel',
    {
      url: '/cancel',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/terminate/cancel/telecom-telephony-line-management-terminate-cancel.html',
          controller: 'TelecomTelephonyLineTerminateCancelCtrl',
          controllerAs: 'TerminateCancelCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
