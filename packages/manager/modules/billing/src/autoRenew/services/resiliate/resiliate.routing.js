import kebabCase from 'lodash/kebabCase';

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

      capabilities: /* @ngInject */ (service) => service.possibleActions,
      goBack: /* @ngInject */ ($state) => (forceRefresh = false) => {
        if (forceRefresh) {
          return $state.go(
            '^',
            { refresh: 'true' },
            { notify: true, reload: true },
          );
        }
        return $state.go('^');
      },
      onSuccess: /* @ngInject */ (Alerter, goBack) => (forceRefresh, message) =>
        goBack(forceRefresh).then(() => {
          Alerter.success(message);
        }),
      onError: /* @ngInject */ (Alerter, goBack) => (message) =>
        goBack().then(() => {
          Alerter.error(message);
        }),
      service: /* @ngInject */ (billingServices, serviceId) =>
        billingServices.find((service) => service.id === serviceId),
      serviceTypeLabel: /* @ngInject */ ($translate, service) =>
        service.isByoipService()
          ? 'BYOIP'
          : $translate.instant(
              `billing_autorenew_service_type_${service.serviceType}`,
            ),
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet, service) =>
      atInternet.trackPage({
        name: `hub::billing::autorenew::${kebabCase(
          service.serviceType,
        )}::resiliate`,
        type: 'navigation',
      }),
  });
};
