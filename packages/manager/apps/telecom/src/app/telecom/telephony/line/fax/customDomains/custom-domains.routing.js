import template from './custom-domains.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.fax.customDomains',
    {
      url: '/customDomains',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          noTranslations: true,
        },
        'faxCustomDomainsView@telecom.telephony.billingAccount.line.fax.customDomains': {
          templateUrl:
            'app/telecom/telephony/service/fax/customDomains/custom-domains.html',
          controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
