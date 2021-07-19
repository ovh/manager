import template from './order-alias.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.orderAlias', {
    url: '/orderAlias',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
      },
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
        component: 'telecomTelephonyBillingAccountOrderAlias',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_order_title'),
    },
  });
};
