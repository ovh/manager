angular
  .module('managerApp')
  .config(($stateProvider) => {
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
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_language_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
