import { BillingService as Service } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.resiliation', {
    url: '/resiliation',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'ovhManagerBillingResiliation',
      },
    },
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
      goBack: /* @ngInject */ (atInternet, goToDashboard) => (
        message,
        type,
      ) => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::resiliation::cancel',
          type: 'action',
        });
        return goToDashboard(message, type);
      },
      onSuccess: /* @ngInject */ (atInternet, goToDashboard) => (
        successMessage,
      ) => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::resiliation::confirm',
          type: 'action',
        });
        return goToDashboard(successMessage);
      },
      serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      service: /* @ngInject */ ($http, coreConfig, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data, coreConfig.getUserLocale())),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_dashboard_resiliate'),
    },
  });
};
