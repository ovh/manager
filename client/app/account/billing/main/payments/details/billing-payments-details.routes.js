angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.payments.details', {
    url: '/:id/details',
    templateUrl: 'account/billing/main/payments/details/billing-payments-details.html',
    controller: 'Billing.PaymentDetailsCtrl',
    controllerAs: '$ctrl',
  });
});
