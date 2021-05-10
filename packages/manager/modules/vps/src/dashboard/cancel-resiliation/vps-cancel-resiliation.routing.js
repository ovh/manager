import snakeCase from 'lodash/snakeCase';
import { BillingService } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.cancel-resiliation', {
    url: '/cancel-resiliation',
    views: {
      modal: {
        component: 'billingCancelResiliation',
      },
    },
    layout: 'modal',
    resolve: {
      cancelResiliation: /* @ngInject */ (
        $http,
        $q,
        engagement,
        setReactivateEngagementStrategy,
      ) => (service) => {
        return (engagement?.isPeriodic()
          ? setReactivateEngagementStrategy()
          : $q.when(0)
        ).then(() => {
          service.cancelResiliation();
          return $http
            .put(`/vps/${service.domain}/serviceInfos`, {
              renew: service.renew,
            })
            .then((result) => {
              if (result.status === 200) {
                return result;
              }
              return $q.reject(result);
            });
        });
      },
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
      service: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/vps/${serviceName}/serviceInfos`).then(
          ({ data: service }) =>
            new BillingService({
              ...service,
              status: snakeCase(service.status).toUpperCase(),
            }),
        ),
      setReactivateEngagementStrategy: /* @ngInject */ (
        $http,
        endStrategies,
        service,
      ) => () =>
        $http.put(`/services/${service.id}/billing/engagement/endRule`, {
          strategy: endStrategies.REACTIVATE_ENGAGEMENT,
        }),
    },
  });
};
