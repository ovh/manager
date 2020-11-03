export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.delete', {
    url: '/delete?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewDelete',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      cancelResiliationUrl: /* @ngInject */ ($state, serviceId) =>
        $state.href('app.account.billing.autorenew.cancelResiliation', {
          serviceId,
        }),
      engagement: /* @ngInject */ (BillingAutoRenew, service) =>
        (service.canHaveEngagement()
          ? BillingAutoRenew.getDedicatedServer(service.serviceId)
          : Promise.resolve({ engagement: null })
        ).then(({ engagement }) => engagement),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.getService(serviceId, serviceType),
      supportPhoneNumber: /* @ngInject */ (constants, currentUser) =>
        constants.SUPPORT[currentUser.ovhSubsidiary],
      updateService: /* @ngInject */ (BillingAutoRenew) => (service) =>
        BillingAutoRenew.updateService(service),
    },
    atInternet: {
      ignore: true,
    },
  });
};
