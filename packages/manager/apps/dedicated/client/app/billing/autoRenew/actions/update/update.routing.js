export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.update', {
    url: '/update?serviceId',
    component: 'billingAutorenewUpdate',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      addPaymentMean: /* @ngInject */ ($state) => () => $state.go('app.account.billing.payment.method.add'),
      autorenewAgreements: /* @ngInject */
        (BillingAutoRenew) => BillingAutoRenew.getAutorenewAgreements(),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) => $transition$.params().serviceId,
      service: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => BillingAutoRenew.getService(serviceId),
      updateRenew: /* @ngInject */
        (BillingAutoRenew) => (
          service,
          agreements,
        ) => BillingAutoRenew.updateRenew(service, agreements),
    },
  });
};
