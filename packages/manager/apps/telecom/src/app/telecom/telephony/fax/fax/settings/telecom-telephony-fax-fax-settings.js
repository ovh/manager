angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.fax.settings',
    {
      url: '/settings',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/fax/fax/settings/telecom-telephony-fax-fax-settings.html',
          noTranslations: true,
        },
        'faxSettingsView@telecom.telephony.billingAccount.fax.dashboard.fax.settings': {
          templateUrl:
            'app/telecom/telephony/service/fax/settings/telecom-telephony-service-fax-settings.html',
          controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
          controllerAs: 'SettingsCtrl',
        },
      },
      translations: {
        value: ['../../../service/fax/settings'],
        format: 'json',
      },
    },
  );
});
