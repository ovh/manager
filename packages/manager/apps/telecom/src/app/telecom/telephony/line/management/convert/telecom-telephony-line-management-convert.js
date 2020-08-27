angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.convert',
    {
      url: '/convert',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/convert/telecom-telephony-line-management-convert.html',
          controller: 'TelecomTelephonyLineConvertCtrl',
          controllerAs: 'LineConvertCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
