export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.delete', {
    url: '/delete?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewDelete',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      cancelResiliationUrl: /* @ngInject */ (
        $state,
        serviceId,
      ) => $state.href('app.account.billing.autorenew.cancelResiliation', { serviceId }),
      engagement: /* @ngInject */ (
        Server,
        service,
      ) => (service.canHaveEngagement()
        ? Server.getSelected(service.serviceId) : Promise.resolve({ engagement: null }))
        .then(({ engagement }) => engagement),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) => $transition$.params().serviceId,
      service: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => BillingAutoRenew.getService(serviceId),
      supportPhoneNumber: /* @ngInject */ (
        constants,
        currentUser,
      ) => constants.SUPPORT[currentUser.ovhSubsidiary],
      updateService: /* @ngInject */ (BillingAutoRenew) => (service) => BillingAutoRenew
        .updateService(service),
    },
  });
};
