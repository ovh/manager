import template from './settings.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax.settings', {
    url: '/settings',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        noTranslations: true,
      },
      'faxSettingsView@telecom.telephony.billingAccount.line.fax.settings': {
        templateUrl: 'app/telecom/telephony/service/fax/settings/settings.html',
        controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
        controllerAs: 'SettingsCtrl',
      },
    },
  });
};
