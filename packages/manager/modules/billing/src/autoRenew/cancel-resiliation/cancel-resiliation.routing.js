import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';
import { EngagementConfiguration } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.cancel-resiliation', {
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
          service.cancelResiliation();
          return BillingAutoRenew.updateService({
            serviceId: service.serviceId,
            serviceType: service.serviceType,
            renew: service.renew,
            route: get(service, 'route.url'),
          });
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
      fetchRenewInfos: /* @ngInject */ ($http, service) =>
        $http
          .get(`${service.route.url}/serviceInfos`)
          .then(({ data }) => data)
          .then(({ renew }) => Object.assign(service, { renew })),
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
