export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.cancel-resiliation', {
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
      cancelResiliation: /* @ngInject */ (
        BillingAutoRenew,
        engagement,
        hasEndRuleStrategies,
        setReactivateEngagementStrategy,
      ) => (service) => {
        if (engagement && hasEndRuleStrategies) {
          return setReactivateEngagementStrategy();
        }

        service.cancelResiliation();
        return BillingAutoRenew.updateService(service);
      },
      engagement: /* @ngInject */ (Server, service) =>
        (service.canHaveEngagement()
          ? Server.getSelected(service.serviceId)
          : Promise.resolve({ engagement: null })
        ).then(({ engagement }) => engagement),
      hasEndRuleStrategies: /* @ngInject */ (engagement, endStrategies) =>
        engagement &&
        engagement.endRule &&
        engagement.endRule.possibleStrategies.includes(
          endStrategies.REACTIVATE_ENGAGEMENT,
        ),
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.getService(serviceId, serviceType),
      setReactivateEngagementStrategy: /* @ngInject */ (
        BillingService,
        endStrategies,
        service,
      ) => () =>
        BillingService.putEndRuleStrategy(
          service.id,
          endStrategies.REACTIVATE_ENGAGEMENT,
        ),
      trackClick: /* @ngInject */ (atInternet) => () =>
        atInternet.trackClick({
          name: 'autorenew::cancel-resiliation',
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'account',
          chapter3: 'billing',
        }),
    },
  });
};
