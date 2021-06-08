export default /* @ngInject */ ($stateProvider) => {
  const hitName =
    'dedicated::account::billing::payment::method::split_payment_activate';

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
