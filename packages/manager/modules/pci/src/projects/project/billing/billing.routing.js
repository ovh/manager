import { groupBy, sortBy, sumBy } from 'lodash';
import { formatBillingDetails, formatPrice, getURL } from './billing.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    componentProvider: /* @ngInject */ (isLegacyProject) =>
      isLegacyProject ? 'pciProjectBillingLegacy' : 'pciProjectBilling',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpbc_billing_control'),
      catalog: /* @ngInject */ ($http, coreConfig) =>
        $http
          .get(
            `/order/catalog/public/cloud?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) => data),
      consumption: /* @ngInject */ (
        $http,
        catalog,
        consumptionDetails,
        coreURLBuilder,
        isLegacyProject,
        projectId,
        serviceInfos,
        service,
      ) =>
        !isLegacyProject
          ? $http
              .get(`/services/${serviceInfos.serviceId}/consumption`)
              .then(({ data }) => data)
              .then((consumption) => ({
                ...consumption,
                priceByPlanFamily: consumption.priceByPlanFamily.map(
                  (price) => {
                    const details = formatBillingDetails(
                      consumptionDetails,
                      price.planFamily,
                      catalog,
                      consumption.price,
                    ).map((detail) => {
                      const url = getURL(price.planFamily, detail.planCode);
                      return {
                        ...detail,
                        url: url
                          ? coreURLBuilder.buildURL('public-cloud', `#${url}`, {
                              serviceName: projectId,
                              id: detail.serviceId,
                            })
                          : null,
                      };
                    });
                    const sortedByPrice = sortBy(details, (detail) =>
                      sumBy(
                        details.filter(({ id }) => id === detail.id),
                        'price.value',
                      ),
                    ).reverse();
                    return {
                      ...price,
                      details: groupBy(sortedByPrice, (element) =>
                        element.id !== element.region
                          ? element.id
                          : `${element.planCode}-${element.uniqueId}`,
                      ),
                    };
                  },
                ),
              }))
              .catch(() => ({
                price: {
                  text: formatPrice(service.billing?.pricing?.price, 0),
                },
              }))
          : {},
      consumptionDetails: /* @ngInject */ (
        $http,
        isLegacyProject,
        serviceInfos,
      ) =>
        !isLegacyProject
          ? $http
              .get(`/services/${serviceInfos.serviceId}/consumption/element`)
              .then(({ data }) => data)
              .then((consumption) => groupBy(consumption, 'planFamily'))
              .catch(() => ({}))
          : {},
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      billingLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing', { projectId }),
      historyLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing.history', {
          projectId,
          year: moment.utc().year(),
          month: moment.utc().month(),
        }),
      estimateLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing.estimate', { projectId }),
    },
  });
};
