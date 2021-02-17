export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.payment.method.activateSplitPayment',
    {
      url: '/activateSplitPayment',
      views: {
        modal: {
          component: 'ovhManagerBillingSplitPaymentAction',
        },
      },
      layout: 'modal',
      resolve: {
        action: /* @ngInject */ ($http, splitPaymentTag) => () =>
          $http.post('/me/tag', {
            tagName: splitPaymentTag,
          }),
        actionLabelKey: () => 'billing_payment_method_split_payment_activate',
        errorMessageKey: () =>
          'billing_payment_method_split_payment_activate_error',
        goBack: /* @ngInject */ (goPaymentList) => goPaymentList,
        successMessageKey: () =>
          'billing_payment_method_split_payment_activate_success',

        breadcrumb: () => null,
      },
    },
  );
};
