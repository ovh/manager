export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.resiliate', {
    url: '/resiliate',
    views: {
      modal: {
        component: 'ovhManagerBillingResiliateModalWrapper',
      },
    },
    layout: 'modal',
    resolve: {
      capabilities: /* @ngInject */ (service) =>
        service.billing.lifecycle.capacities.actions,
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
      serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      service: /* @ngInject */ ($http, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => ({ ...data, id: serviceId })),
      serviceTypeLabel: /* @ngInject */ (service) =>
        service.resource.displayName,
    },
    atInternet: {
      ignore: true,
    },
  });
};
