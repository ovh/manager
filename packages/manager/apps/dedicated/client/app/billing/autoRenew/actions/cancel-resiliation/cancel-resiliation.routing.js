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
        $http,
        endStrategies,
        service,
      ) => () =>
        $http.put(`/services/${service.id}/billing/engagement/endRule`, {
          strategy: endStrategies.REACTIVATE_ENGAGEMENT,
        }),
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
