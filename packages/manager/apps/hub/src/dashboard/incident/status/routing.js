export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.status', {
    url: '/status',
    component: 'hubIncidentStatus',
    resolve: {
      services: /* @ngInject */ ($http) =>
        $http
          .get('/incident-status', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .catch(() => []),
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
    },
  });
};
