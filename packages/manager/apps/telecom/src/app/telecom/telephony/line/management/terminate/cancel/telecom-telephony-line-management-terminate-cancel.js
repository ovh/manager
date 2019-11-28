angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.terminate.cancel', {
    url: '/cancel',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/terminate/cancel/telecom-telephony-line-management-terminate-cancel.html',
        controller: 'TelecomTelephonyLineTerminateCancelCtrl',
        controllerAs: 'TerminateCancelCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
