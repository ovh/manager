import kebabCase from 'lodash/kebabCase';
import { EngagementConfiguration } from '@ovh-ux/manager-models';
import { SERVICE_TYPES_USING_V6_SERVICES } from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.cancel-resiliationRedirection', {
    url: '/cancel-resiliation?serviceId&serviceType',
    redirectTo: 'billing.autorenew.services.cancel-resiliation',
  });

  $stateProvider.state('billing.autorenew.services.cancel-resiliation', {
    url: '/cancel-resiliation?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingCancelResiliation',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet, service) =>
      atInternet.trackPage({
        name: `account::billing::autorenew::${kebabCase(
          service.serviceType,
        )}::cancel-resiliation`,
        type: 'navigation',
      }),
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      cancelResiliation: /* @ngInject */ (
        $q,
        BillingAutoRenew,
        engagement,
        hasEndRuleStrategies,
        setReactivateEngagementStrategy,
      ) => (service) => {
        return (engagement && hasEndRuleStrategies
          ? setReactivateEngagementStrategy()
          : $q.when(0)
        ).then(() => {
          if (SERVICE_TYPES_USING_V6_SERVICES.includes(service.serviceType)) {
            return BillingAutoRenew.updateRenew(service);
          }

          service.cancelResiliation();
          return BillingAutoRenew.updateService(service);
        });
      },
      engagement: /* @ngInject */ ($http, service) =>
        (service.canHaveEngagement()
          ? $http
              .get(`/services/${service.id}`)
              .then(({ data }) =>
                data.billing?.pricing?.engagementConfiguration
                  ? new EngagementConfiguration(
                      data.billing?.pricing?.engagementConfiguration,
                    )
                  : { engagement: null },
              )
              .catch({ engagement: null })
          : Promise.resolve({ engagement: null })
        ).then(({ engagement }) => engagement),
      endStrategies: /* @ngInject */ (endStrategyEnum) =>
        endStrategyEnum.reduce(
          (object, strategy) => ({
            ...object,
            [strategy]: strategy,
          }),
          {},
        ),
      hasEndRuleStrategies: /* @ngInject */ (engagement, endStrategies) =>
        engagement &&
        engagement.endRule &&
        engagement.endRule.possibleStrategies.includes(
          endStrategies.REACTIVATE_ENGAGEMENT,
        ),
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.findService({ resourceName: serviceId, serviceType }),
      fetchRenewInfos: /* @ngInject */ ($http, service) => {
        if (SERVICE_TYPES_USING_V6_SERVICES.includes(service.serviceType)) {
          return Promise.resolve(service);
        }

        return $http
          .get(`${service.route.url}/serviceInfos`)
          .then(({ data }) => data)
          .then(({ renew }) => Object.assign(service, { renew }));
      },
      setReactivateEngagementStrategy: /* @ngInject */ (
        BillingService,
        endStrategies,
        service,
      ) => () =>
        BillingService.putEndRuleStrategy(
          service.id,
          endStrategies.REACTIVATE_ENGAGEMENT,
        ),
      trackClick: /* @ngInject */ (atInternet, service) => () =>
        atInternet.trackClick({
          name: `autorenew::${kebabCase(
            service.serviceType,
          )}::cancel-resiliation::confirm`,
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'account',
          chapter3: 'billing',
        }),
      breadcrumb: () => null,
    },
  });
};
