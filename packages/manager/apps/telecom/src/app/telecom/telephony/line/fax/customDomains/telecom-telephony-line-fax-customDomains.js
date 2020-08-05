angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.fax.customDomains',
      {
        url: '/customDomains',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/fax/customDomains/telecom-telephony-line-fax-customDomains.html',
            noTranslations: true,
          },
          'faxCustomDomainsView@telecom.telephony.billingAccount.line.dashboard.fax.customDomains': {
            templateUrl:
              'app/telecom/telephony/service/fax/customDomains/telecom-telephony-service-fax-customDomains.html',
            controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_fax_custom_domains_breadcrumb'),
        },
        translations: {
          value: ['../../../service/fax/customDomains'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
