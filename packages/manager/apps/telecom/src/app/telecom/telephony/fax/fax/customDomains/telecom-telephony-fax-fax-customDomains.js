angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.fax.customDomains',
      {
        url: '/customDomains',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/fax/fax/customDomains/telecom-telephony-fax-fax-customDomains.html',
            noTranslations: true,
          },
          'faxCustomDomainsView@telecom.telephony.billingAccount.fax.dashboard.fax.customDomains': {
            templateUrl:
              'app/telecom/telephony/service/fax/customDomains/telecom-telephony-service-fax-customDomains.html',
            controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_fax_fax_custom_domains_breadcrumb'),
        },
        translations: {
          value: ['../../../service/fax/customDomains'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
