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
      onSuccess: /* @ngInject */ (atInternet, goBack) => (successMessage) => {
        atInternet.trackClick({
          name: 'vps::detail::dashboard::resiliation::confirm',
          type: 'action',
        });
        return goBack(successMessage);
      },
      goBack: /* @ngInject */ ($state, atInternet, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
        options = {},
      ) => {
        const state = 'vps.detail.dashboard';
        const promise = $state.go(state, data, {
          reload: message && type === 'success',
          ...options,
        });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        } else {
          atInternet.trackClick({
            name: 'vps::detail::dashboard::resiliation::cancel',
            type: 'action',
          });
        }
        return promise;
      },
      serviceId: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
      service: /* @ngInject */ ($http, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data)),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_resiliate'),
    },
  });
};
