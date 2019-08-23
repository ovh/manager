angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.fax.settings', {
    url: '/settings',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/fax/settings/telecom-telephony-line-fax-settings.html',
        noTranslations: true,
      },
      'faxSettingsView@telecom.telephony.line.fax.settings': {
        templateUrl: 'app/telecom/telephony/service/fax/settings/telecom-telephony-service-fax-settings.html',
        controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
        controllerAs: 'SettingsCtrl',
      },
    },
  });
});
