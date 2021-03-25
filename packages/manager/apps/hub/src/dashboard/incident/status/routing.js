export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.status', {
    url: '/status',
    component: 'hubIncidentStatus',
    params: {
      message: null,
    },
    resolve: {
      canResiliate: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('billing:sbgResiliation')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable('billing:sbgResiliation'),
          )
          .catch(() => false),
      services: /* @ngInject */ (servicesStatus) => servicesStatus,
      translatedStatusEnum: /* @ngInject */ ($translate, services) =>
        services
          .map((service) => service.status)
          .reduce(
            (options, status) => ({
              ...options,
              [status]: $translate.instant(
                `manager_hub_incident_status_service_status_${status}`,
              ),
            }),
            {},
          ),
      translatedServiceEnum: /* @ngInject */ ($translate, services) =>
        services
          .map((service) => service.productType)
          .reduce(
            (options, productType) => ({
              ...options,
              [productType]: $translate.instant(
                `manager_hub_incident_status_product_${productType}`,
              ),
            }),
            {},
          ),
      hideBreadcrumb: () => true,
      goToStatus: /* @ngInject */ ($state, $transition$) => (
        message = false,
        type = 'success',
      ) => {
        return $state.go('app.dashboard.incident.status', {
          ...$transition$.params,
          message: {
            value: message,
            type,
          },
        });
      },
      goToResiliation: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.go('app.dashboard.incident.status.resiliate', {
          serviceName,
        }),
      goToDeleteInstances: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.go('app.dashboard.incident.status.resiliate-pci', {
          serviceName,
        }),
      message: /* @ngInject */ ($transition$) => $transition$.params().message,
    },
  });
};
