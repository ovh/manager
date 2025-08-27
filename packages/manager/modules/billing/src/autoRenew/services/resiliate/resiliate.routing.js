export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.services.resiliation', {
    url: '/resiliate?serviceId',
    views: {
      modal: {
        component: 'ovhManagerBillingResiliateModal',
      },
    },
    layout: 'modal',
    resolve: {
      serviceId: /* @ngInject */ ($transition$) =>
        parseInt($transition$.params().serviceId, 10),

      // Should be coming from the service's `billing.lifecycle.capacities.actions` property
      capabilities: () => ['terminate', 'terminateAtExpirationDate'],
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      onSuccess: /* @ngInject */ (Alerter, goBack) => (message) =>
        goBack().then(() => {
          Alerter.success(message);
        }),
      onError: /* @ngInject */ (Alerter, goBack) => (message) =>
        goBack().then(() => {
          Alerter.error(message);
        }),
      service: /* @ngInject */ (billingServices, serviceId) =>
        billingServices.find((service) => service.id === serviceId),
      // TODO: do we need to have BYOIP specific wording ?
      serviceTypeLabel: /* @ngInject */ ($translate, service) =>
        $translate.instant(
          `billing_autorenew_service_type_${service.serviceType}`,
        ),
    },
    // FIXME: add atInternet property for tracking
  });
};
