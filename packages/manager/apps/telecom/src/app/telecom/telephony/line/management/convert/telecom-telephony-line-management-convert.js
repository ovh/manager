angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.convert', {
    url: '/convert',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/convert/telecom-telephony-line-management-convert.html',
        controller: 'TelecomTelephonyLineConvertCtrl',
        controllerAs: 'LineConvertCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
