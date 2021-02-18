import template from './settings.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.settings',
    {
      url: '/settings',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxSettingsView@telecom.telephony.billingAccount.line.dashboard.fax.settings': {
          templateUrl:
            'app/telecom/telephony/service/fax/settings/settings.html',
          controller: 'TelecomTelephonyServiceFaxSettingsCtrl',
          controllerAs: 'SettingsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_fax_settings_breadcrumb'),
      },
    },
  );
};
