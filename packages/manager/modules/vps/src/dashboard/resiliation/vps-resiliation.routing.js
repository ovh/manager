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
      onSuccess: /* @ngInject */ (trackClick, goBack) => (
        successMessage,
        endStrategy,
      ) => {
        const hitToConcat = endStrategy ? `_${endStrategy}` : '';
        trackClick(
          `vps::detail::dashboard::resiliation::confirm${hitToConcat}`,
        );

        return goBack(successMessage);
      },
      goBack: /* @ngInject */ ($state, trackClick, CucCloudMessage) => (
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
          trackClick('vps::detail::dashboard::resiliation::cancel');
        }
        return promise;
      },
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
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
