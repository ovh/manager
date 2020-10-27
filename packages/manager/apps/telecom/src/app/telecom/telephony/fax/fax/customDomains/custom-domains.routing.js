import template from './custom-domains.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.fax.customDomains',
    {
      url: '/customDomains',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          noTranslations: true,
        },
        'faxCustomDomainsView@telecom.telephony.billingAccount.fax.fax.customDomains': {
          templateUrl:
            'app/telecom/telephony/service/fax/customDomains/custom-domains.html',
          controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
          controllerAs: '$ctrl',
        },
      },
    },
  );
};
