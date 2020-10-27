import template from './non-geographical.html';
import controller from './non-geographical.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.orderAlias.nongeographical',
    {
      url: '/nonGeographical',
      views: {
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          template,
          controller,
          controllerAs: 'AliasOrderNonGeographicalCtrl',
        },
      },
    },
  );
};
