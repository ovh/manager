import { buildURL } from '@ovh-ux/ufrontend/url-builder';

const getResiliationLink = (service) =>
  buildURL('dedicated', '#/billing/autorenew/delete', {
    serviceId: service.serviceName,
    serviceType: service.productType,
  });

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.status.resiliate', {
    url: '/resiliate?serviceName',
    views: {
      modal: {
        component: 'hubIncidentStatusResiliation',
      },
    },
    layout: 'modal',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      service: /* @ngInject */ (services, serviceName) =>
        services.find(({ serviceName: id }) => id === serviceName),
      hideBreadcrumb: () => true,
      goBack: /* @ngInject */ (goToStatus) => goToStatus,
      askForResiliation: /* @ngInject */ (
        $http,
        $q,
        $window,
        service,
      ) => () => {
        if (service.isEngaged) {
          return $http.post(`/support/service/terminateSBG`, {
            serviceId: service.serviceId,
          });
        }

        if (service.terminateRoute) {
          return $http.post(service.terminateRoute);
        }

        $window.location.assign(getResiliationLink(service));
        return $q.when();
      },
    },
  });
};
