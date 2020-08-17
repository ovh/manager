angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.calls.click2call.changePassword',
    {
      url: '/modify/:userId',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          templateUrl:
            'app/telecom/telephony/line/calls/click2Call/change-password/telecom-telephony-line-calls-click2Call-change-password.html',
          controller: 'TelecomTelephonyLineClick2CallChangePasswordCtrl',
          controllerAs: 'Click2CallChangePasswordCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
