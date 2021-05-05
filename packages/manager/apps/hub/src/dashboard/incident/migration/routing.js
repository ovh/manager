import {
  applyTax,
  formatPrice,
  getDatacenter,
  getPrice,
  getProposedDatacenter,
  getDiscountAsMonth,
  buildAddonsCommercialName,
} from './Offer.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.migration', {
    url: '/migration',
    component: 'hubIncidentMigration',
    params: {
      message: null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('servicesToMigrate')
        .then(() => false)
        .catch(() => 'app.dashboard'),
    resolve: {
      trackingPrefix: () => 'hub::service-replacement',
      incidentName: /* @ngInject */ ($transition$) =>
        $transition$.params().incidentName.toLowerCase(),
      goToIncident: /* @ngInject */ ($state, $transition$) => (
        message = false,
        forceReload = false,
      ) => {
        const reload = forceReload || !!message;
        return $state.go(
          'app.dashboard.incident.migration',
          {
            ...$transition$.params,
            message,
          },
          {
            reload,
          },
        );
      },
      message: /* @ngInject */ ($transition$) => $transition$.params().message,
      goToContracts: /* @ngInject */ ($state, $transition$) => (servicesIds) =>
        $state.go('app.dashboard.incident.migration.contracts', {
          ...$transition$.params(),
          servicesIds,
        }),
      confirmMigration: /* @ngInject */ ($state, $transition$) => (
        servicesIds,
      ) =>
        $state.go('app.dashboard.incident.migration.confirm', {
          ...$transition$.params(),
          servicesIds,
        }),
      shouldDisplayPriceTTC: /* @ngInject */ (coreConfig) =>
        ['DE', 'SN'].includes(coreConfig.getUser().ovhSubsidiary),
      impactedServices: /* @ngInject */ (
        coreConfig,
        servicesToMigrate,
        services,
        servicesStatus,
        shouldDisplayPriceTTC,
      ) => {
        const allServices = Object.values(services.data?.data).flatMap(
          ({ data }) => data,
        );
        return servicesToMigrate
          .filter(({ orderId }) => !orderId)
          .map((service) => {
            const price = parseFloat(getPrice(service)).toFixed(2);
            return {
              serviceToMigrate: {
                ...service.serviceToMigrate,
                status: servicesStatus.find(
                  ({ serviceName }) =>
                    serviceName === service.serviceToMigrate.serviceName,
                )?.status,
                datacenter: getDatacenter(
                  service.serviceToMigrate.metadata,
                  'datacenter',
                ),
                addonsDescription: buildAddonsCommercialName(
                  service,
                  'serviceToMigrate.description',
                ),
                url: allServices.find(
                  ({ serviceId }) =>
                    serviceId === service.serviceToMigrate.serviceId,
                )?.url,
              },
              proposedOffer: {
                ...service.proposedOffer,
                addonsDescription: buildAddonsCommercialName(
                  service,
                  'proposedOffer.plan.productName',
                ),
                datacenter: getProposedDatacenter(
                  service.proposedOffer.configurations,
                ).toUpperCase(),
                promotionDuration: getDiscountAsMonth(service.proposedOffer),
                price: shouldDisplayPriceTTC
                  ? formatPrice(
                      service,
                      applyTax(price, coreConfig.getUser().ovhSubsidiary),
                    )
                  : formatPrice(service, price),
              },
            };
          });
      },
      servicesToMigrate: /* @ngInject */ ($http, incidentName) =>
        $http
          .get(`/me/incident/${incidentName}/migrateServices`)
          .then(({ data }) => data),
      migrateServices: /* @ngInject */ ($http, incidentName) => (
        dryRun,
        serviceIds,
      ) =>
        $http
          .post(`/me/incident/${incidentName}/migrateServices`, {
            dryRun,
            serviceIds,
          })
          .then(({ data }) => data),
      hideBreadcrumb: /* @ngInject */ () => true,
    },
    atInternet: {
      rename: 'service-replacement',
    },
  });
};
