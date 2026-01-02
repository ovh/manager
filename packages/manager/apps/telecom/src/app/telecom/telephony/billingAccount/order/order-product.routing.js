export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.orderProduct', {
    url: '/orderProduct',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        component: 'telecomTelephonyBillingAccountOrderProduct',
      },
    },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      billingAccountId: /* @ngInject */ (billingAccount) => billingAccount,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_order'),
    },
  });
};
