import { BillingService as Service } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.resiliation', {
    url: '/resiliation',
    views: {
      'vpsContent@vps.detail': {
        component: 'ovhManagerBillingResiliation',
      },
    },
    resolve: {
      availableStrategies: /* @ngInject */ (endStrategyEnum, service) =>
        endStrategyEnum
          .filter((strategy) =>
            service.billing.engagement?.endRule.possibleStrategies.includes(
              strategy,
            ),
          )
          .map((strategy) => ({
            strategy,
          })),
      displayErrorMessage: /* @ngInject */ (goBack) => (message) =>
        goBack(message, 'error'),
      endStrategies: /* @ngInject */ (endStrategyEnum) =>
        endStrategyEnum.reduce(
          (object, strategy) => ({
            ...object,
            [strategy]: strategy,
          }),
          {},
        ),
      endStrategyEnum: /* @ngInject */ ($http) =>
        $http
          .get('/services.json')
          .then(
            ({ data }) =>
              data.models['services.billing.engagement.EndStrategyEnum']?.enum,
          ),
      onSuccess: /* @ngInject */ (goBack) => (successMessage) =>
        goBack(successMessage),
      serviceId: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
      service: /* @ngInject */ ($http, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data)),
    },
  });
};
