import { HOSTING_CDN_CANCEL_TERMINATE_HIT_PREFIX } from './hosting-cdn-cancel-terminate.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.general-informations.cdn-cancel-terminate',
    {
      url: '/cdn/cancel-terminate',
      layout: 'modal',
      views: {
        modal: {
          component: 'hostingCdnCancelTerminate',
        },
      },
      params: {
        cdnServiceInfo: null,
        alerts: null,
      },
      redirectTo: (transition) =>
        Promise.all([transition.injector().getAsync('cdnServiceInfo')]).then(
          ([cdnServiceInfo]) => {
            return !cdnServiceInfo ||
              cdnServiceInfo.renew.mode !== 'deleteAtExpiration'
              ? 'app.hosting.dashboard.general-informations'
              : false;
          },
        ),
      resolve: {
        breadcrumb: () => null,

        cdnServiceInfo: /* @ngInject */ ($transition$) =>
          $transition$.params().cdnServiceInfo,

        alerts: /* @ngInject */ ($transition$) => $transition$.params().alerts,

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
            name: `${HOSTING_CDN_CANCEL_TERMINATE_HIT_PREFIX}::${hitPrefix}`,
            type: 'action',
          });
        },
      },
      atInternet: {
        rename: HOSTING_CDN_CANCEL_TERMINATE_HIT_PREFIX,
      },
    },
  );
};
