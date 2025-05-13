import { BillingService as Service } from '@ovh-ux/manager-models';
import set from 'lodash/set';

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
      goBack: /* @ngInject */ (trackClick, goToDashboard) => (
        message,
        type,
      ) => {
        trackClick(
          'dedicated::dedicated::server::dashboard::resiliation::cancel',
        );
        return goToDashboard(message, type);
      },
      onSuccess: /* @ngInject */ (
        trackClick,
        goToDashboard,
        goToDeleteService,
        endStrategies,
      ) => (successMessage, endStrategy) => {
        const hitToConcat = endStrategy ? `_${endStrategy}` : '';
        trackClick(
          `dedicated::dedicated::server::dashboard::resiliation::confirm${hitToConcat}`,
        );
        if (endStrategy === endStrategies.CANCEL_SERVICE) {
          return goToDeleteService();
        }
        return goToDashboard(successMessage);
      },
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      goToDeleteService: /* @ngInject */ (
        $window,
        coreURLBuilder,
        serviceName,
      ) => () => {
        set(
          $window.location,
          'href',
          coreURLBuilder.buildURL(
            'dedicated',
            `#/billing/autorenew/delete?serviceId=${serviceName}`,
          ),
        );
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
