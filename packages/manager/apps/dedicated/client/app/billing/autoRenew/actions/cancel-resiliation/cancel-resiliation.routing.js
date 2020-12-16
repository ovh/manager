export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.cancelResiliation', {
    url: '/cancel-resiliation?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingCancelResiliation',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      cancelResiliation: /* @ngInject */ (BillingAutoRenew) => (service) => {
        service.cancelResiliation();
        return BillingAutoRenew.updateService(service);
      },
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.getService(serviceId, serviceType),
      trackClickInformation: () => ({
        name: 'autorenew::cancel-resiliation',
        type: 'action',
        chapter1: 'dedicated',
        chapter2: 'account',
        chapter3: 'billing',
      }),
    },
  });
};
