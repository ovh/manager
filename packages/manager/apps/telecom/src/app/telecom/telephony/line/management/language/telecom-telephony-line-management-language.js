angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.language', {
    url: '/language',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/language/telecom-telephony-line-management-language.html',
        controller: 'TelecomTelephonyLineManagementLanguageCtrl',
        controllerAs: 'LineLanguage',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
