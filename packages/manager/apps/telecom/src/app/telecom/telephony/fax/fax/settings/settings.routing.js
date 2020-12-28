import template from './settings.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax.settings', {
    url: '/settings',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        noTranslations: true,
      },
      'faxSettingsView@telecom.telephony.billingAccount.fax.fax.settings': {
        templateUrl: 'app/telecom/telephony/service/fax/settings/settings.html',
        controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
        controllerAs: 'SettingsCtrl',
      },
    },
  });
};
