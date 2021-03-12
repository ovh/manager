export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.migration.contracts', {
    url: '/contracts',
    layout: 'modal',
    params: {
      servicesIds: {
        value: '[]',
      },
    },
    views: {
      modal: {
        component: 'hubIncidentMigrationContracts',
      },
    },
    resolve: {
      goBackToDashboard: /* @ngInject */ ($state) => () =>
        $state.go('app.dashboard'),

      isAllServicesToMigrate: (impactedServices, servicesIds) =>
        servicesIds.length === impactedServices.length,

      selectedServices: /* @ngInject */ (migrateServices, servicesIds) =>
        migrateServices(true, servicesIds),

      servicesIds: /* @ngInject */ ($transition$) =>
        $transition$.params().servicesIds,

      contracts: /* @ngInject */ (selectedServices) =>
        selectedServices.order.contracts,

      getServiceDashboardUrl: /* @ngInject */ (
        $state,
        impactedServices,
        servicesIds,
      ) => () =>
        impactedServices.find(
          ({ serviceToMigrate }) =>
            serviceToMigrate.serviceId === servicesIds[0],
        )?.serviceToMigrate?.url ||
        $state.href('app.dashboard.incident.migration'),

      redirectToServiceDashboard: /* @ngInject */ (
        $window,
        getServiceDashboardUrl,
      ) => () => $window.open(getServiceDashboardUrl(), '_self'),

      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: 'service-replacement::contract-validation',
    },
  });
};
