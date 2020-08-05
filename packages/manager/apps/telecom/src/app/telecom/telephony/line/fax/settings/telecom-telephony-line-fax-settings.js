angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.fax.settings',
      {
        url: '/settings',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/fax/settings/telecom-telephony-line-fax-settings.html',
            noTranslations: true,
          },
          'faxSettingsView@telecom.telephony.billingAccount.line.dashboard.fax.settings': {
            templateUrl:
              'app/telecom/telephony/service/fax/settings/telecom-telephony-service-fax-settings.html',
            controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
            controllerAs: 'SettingsCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_fax_settings_breadcrumb'),
        },
        translations: {
          value: ['../../../service/fax/settings'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
