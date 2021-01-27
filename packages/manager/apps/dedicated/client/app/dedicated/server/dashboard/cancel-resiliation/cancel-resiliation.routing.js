import find from 'lodash/find';
import { BillingService } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.cancel-resiliation',
    {
      url: '/cancel-resiliation',
      views: {
        modal: {
          component: 'billingCancelResiliation',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
        cancelResiliation: /* @ngInject */ (
          BillingAutoRenew,
          engagement,
          setReactivateEngagementStrategy,
        ) => (service) => {
          if (engagement) {
            return setReactivateEngagementStrategy();
          }

          service.cancelResiliation();
          return BillingAutoRenew.updateService(service);
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
                data.models['services.billing.engagement.EndStrategyEnum']
                  ?.enum,
            ),
        engagement: /* @ngInject */ (Server, service) =>
          (service.canHaveEngagement()
            ? Server.getSelected(service.serviceId)
            : Promise.resolve({ engagement: null })
          ).then(({ engagement }) => engagement),
        service: /* @ngInject */ ($transition$, BillingAutoRenew) =>
          BillingAutoRenew.getService(
            $transition$.params().productId,
            'DEDICATED_SERVER',
          ),
        setReactivateEngagementStrategy: /* @ngInject */ (
          $http,
          endStrategies,
          service,
        ) => () =>
          $http.put(`/services/${service.id}/billing/engagement/endRule`, {
            strategy: endStrategies.REACTIVATE_ENGAGEMENT,
          }),
        trackClick: /* @ngInject */ (atInternet) => () =>
          atInternet.trackClick({
            name: 'cancel-resiliation',
            type: 'action',
            chapter1: 'dedicated',
            chapter2: 'server',
            chapter3: 'dashboard',
          }),
        breadcrumb: () => null,
      },
=======
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      cancelResiliation: /* @ngInject */ (
        $q,
        engagement,
        OvhApiBillingAutorenewServices,
        setReactivateEngagementStrategy,
      ) => (service) => {
        if (engagement) {
          return setReactivateEngagementStrategy();
        }

        service.cancelResiliation();
        return OvhApiBillingAutorenewServices.Aapi()
          .put({}, { updateList: [service] })
          .$promise.then((result) => {
            if (result.state === 'OK') {
              return result;
            }
            return $q.reject(result);
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
      engagement: /* @ngInject */ (Server, service) =>
        (service.canHaveEngagement()
          ? Server.getSelected(service.serviceId)
          : Promise.resolve({ engagement: null })
        ).then(({ engagement }) => engagement),
      service: /* @ngInject */ ($transition$, OvhApiBillingAutorenewServices) =>
        OvhApiBillingAutorenewServices.Aapi()
          .query({
            search: $transition$.params().productId,
          })
          .$promise.then((services) =>
            find(services.list.results, {
              serviceType: 'DEDICATED_SERVER',
              serviceId: $transition$.params().productId,
            }),
          )
          .then((service) => new BillingService(service)),
      setReactivateEngagementStrategy: /* @ngInject */ (
        $http,
        endStrategies,
        service,
      ) => () =>
        $http.put(`/services/${service.id}/billing/engagement/endRule`, {
          strategy: endStrategies.REACTIVATE_ENGAGEMENT,
        }),
      trackClick: /* @ngInject */ (atInternet) => () =>
        atInternet.trackClick({
          name: 'cancel-resiliation',
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'server',
          chapter3: 'dashboard',
        }),
    },
  );
};
