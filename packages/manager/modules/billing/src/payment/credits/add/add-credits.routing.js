export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.payment.credits.add', {
    url: '/add',
    layout: 'modal',
    views: {
      modal: {
        component: 'billingPaymentCreditsAdd',
      },
    },
    resolve: {
      addCreditCode: /* @ngInject */ ($http) => (inputCode) =>
        $http.post('/me/credit/code', { inputCode }),
      goBack: /* @ngInject */ (goToCredits) => goToCredits,
      breadcrumb: () => null,
    },
  });
};
