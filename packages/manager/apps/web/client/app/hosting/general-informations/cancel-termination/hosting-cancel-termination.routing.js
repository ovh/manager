import {
  HOSTING_CANCEL_TERMINATION_HIT_PREFIX,
  REACTIVATE_ENGAGEMENT_STRATEGY,
} from './hosting-cancel-termination.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.general-informations.cancel-termination',
    {
      url: '/cancel-termination',
      layout: 'modal',
      views: {
        modal: {
          component: 'hostingCancelTermination',
        },
      },
      params: {
        serviceInfos: null,
        alerts: null,
      },
      redirectTo: (transition) =>
        Promise.all([transition.injector().getAsync('serviceInfos')]).then(
          ([serviceInfos]) => {
            return !serviceInfos?.renew?.deleteAtExpiration
              ? 'app.hosting.dashboard.general-informations'
              : false;
          },
        ),
      resolve: {
        breadcrumb: () => null,

        serviceInfos: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceInfos,

        alerts: /* @ngInject */ ($transition$) => $transition$.params().alerts,

        service: /* @ngInject */ ($http, serviceInfos) =>
          $http
            .get(`/services/${serviceInfos.serviceId}`)
            .then(({ data }) => data)
            .catch(() => null),

        terminationDate: /* @ngInject */ (service, serviceInfos) =>
          service?.billing?.lifecycle?.current?.terminationDate ||
          serviceInfos.expiration,

        hasReactivateStrategy: /* @ngInject */ (service) =>
          service?.billing?.pricing?.engagementConfiguration?.endRule?.possibleStrategies?.includes(
            REACTIVATE_ENGAGEMENT_STRATEGY,
          ) || false,

        goBack: /* @ngInject */ ($state, alerts, Alerter) => (
          message = '',
          type = 'success',
          where = alerts.main,
        ) => {
          const reload = message && type === 'success';

          const promise = $state.go('^', null, {
            reload,
          });

          if (message) {
            promise.then(() => Alerter[type](message, where));
          }

          return promise;
        },

        trackClick: /* @ngInject */ (atInternet) => (hitPrefix) => {
          atInternet.trackClick({
            name: `${HOSTING_CANCEL_TERMINATION_HIT_PREFIX}::${hitPrefix}`,
            type: 'action',
          });
        },
      },
      atInternet: {
        rename: HOSTING_CANCEL_TERMINATION_HIT_PREFIX,
      },
    },
  );
};
