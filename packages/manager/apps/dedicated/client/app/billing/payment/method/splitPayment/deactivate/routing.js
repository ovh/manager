export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.payment.method.deactivateSplitPayment',
    {
      url: '/deactivateSplitPayment',
      views: {
        modal: {
          component: 'ovhManagerBillingSplitPaymentAction',
        },
      },
      layout: 'modal',
      resolve: {
        action: /* @ngInject */ ($http, splitPaymentTag) => () =>
          $http.delete(`/me/tag/${splitPaymentTag}`),
        actionLabelKey: () => 'billing_payment_method_split_payment_deactivate',
        errorMessageKey: () =>
          'billing_payment_method_split_payment_deactivate_error',
        goBack: /* @ngInject */ (goPaymentList) => goPaymentList,
        successMessageKey: () =>
          'billing_payment_method_split_payment_deactivate_success',

        breadcrumb: () => null,
      },
    },
  );
};
