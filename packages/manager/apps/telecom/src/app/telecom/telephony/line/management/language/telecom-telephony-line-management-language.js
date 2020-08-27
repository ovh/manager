angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.language',
    {
      url: '/language',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/management/language/telecom-telephony-line-management-language.html',
          controller: 'TelecomTelephonyLineManagementLanguageCtrl',
          controllerAs: 'LineLanguage',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
