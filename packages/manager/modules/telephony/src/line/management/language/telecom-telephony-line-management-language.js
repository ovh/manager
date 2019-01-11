angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.language', {
    url: '/language',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/language/telecom-telephony-line-management-language.html',
        controller: 'TelecomTelephonyLineManagementLanguageCtrl',
        controllerAs: 'LineLanguage',
      },
    },
    translations: ['.'],
  });
});
