export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.status.resiliate-pci', {
    url: '/delete-instances?serviceName',
    views: {
      modal: {
        component: 'hubIncidentStatusResiliationPci',
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
      deleteInstances: /* @ngInject */ ($window, service) => () =>
        $window.location.assign(`${service.url}/instances`),
    },
  });
};
