import template from './custom-domains.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.customDomains',
    {
      url: '/customDomains',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxCustomDomainsView@telecom.telephony.billingAccount.line.dashboard.fax.customDomains': {
          templateUrl:
            'app/telecom/telephony/service/fax/customDomains/custom-domains.html',
          controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_fax_custom_domains_breadcrumb'),
      },
    },
  );
};
