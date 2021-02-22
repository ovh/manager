export default /* @ngInject */ ($stateProvider) => {
  const hitName =
    'dedicated::account::billing::payment::method::split_payment_deactivate';

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

        trackClick: /* @ngInject */ (atInternet) => () =>
          atInternet.trackClick({
            name: `${hitName}::confirm`,
            type: 'action',
            chapter1: 'dedicated',
            chapter2: 'account',
            chapter3: 'billing',
          }),

        trackPage: /* @ngInject */ (atInternet) => (hitSuffix) =>
          atInternet.trackPage({
            name: `${hitName}_${hitSuffix}`,
            chapter1: 'dedicated',
            chapter2: 'account',
            chapter3: 'billing',
          }),

        breadcrumb: () => null,
      },
      atInternet: {
        rename: hitName,
      },
    },
  );
};
