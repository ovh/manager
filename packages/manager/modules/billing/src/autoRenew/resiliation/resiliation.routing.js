import kebabCase from 'lodash/kebabCase';

import { BillingService as Service } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.resiliation', {
    url: '/resiliation?serviceId&serviceName&serviceType',
    component: 'ovhManagerBillingResiliation',
    resolve: {
      availableStrategies: /* @ngInjecgt */ (endStrategyEnum, service) =>
        endStrategyEnum
          .filter((strategy) =>
            service.billing.engagement?.endRule.possibleStrategies.includes(
              strategy,
            ),
          )
          .map((strategy) => ({
            strategy,
          })),
      displayErrorMessage: /* @ngInject */ (Alerter) => (message) =>
        Alerter.set('alert-danger', message),
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      onSuccess: /* @ngInject */ (Alerter, goBack) => (successMessage) =>
        goBack().then(() => {
          Alerter.success(successMessage);
        }),
      service: /* @ngInject */ ($http, coreConfig, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data, coreConfig.getUserLocale())),
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      validate: /* @ngInject */ (BillingService, serviceId) => (strategy) =>
        BillingService.putEndRuleStrategy(serviceId, strategy),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_resiliate'),
    },
    atInternet: {
      rename: /* @ngInject */ ($state) =>
        // We're limited with the possible injection as we listen to onBefore hook
        `dedicated::account::billing::autorenew::${kebabCase(
          $state.transition.params().serviceType,
        )}::resiliation`,
    },
  });
};
