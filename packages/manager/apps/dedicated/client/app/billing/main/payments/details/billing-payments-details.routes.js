angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.payments.payment', {
    url: '/:id',
    template: '<div ui-view></div>',
    redirectTo: 'app.account.billing.main.payments.payment.details',
    resolve: {
      paymentId: /* @ngInject */ ($transition$) => $transition$.params().id,
      breadcrumb: /* @ngInject */ (paymentId) => paymentId,
    },
  });

  $stateProvider.state('app.account.billing.main.payments.payment.details', {
    url: '/details',
    templateUrl: 'billing/main/payments/details/billing-payments-details.html',
    controller: 'Billing.PaymentDetailsCtrl',
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
});
