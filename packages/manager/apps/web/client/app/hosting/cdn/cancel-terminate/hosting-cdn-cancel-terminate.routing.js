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
        hosting: null,
        alerts: null,
      },
      redirectTo: (transition) =>
        Promise.all([transition.injector().getAsync('hosting')]).then(
          ([hosting]) => {
            return !hosting || !hosting.serviceInfos.renew.deleteAtExpiration
              ? 'app.hosting.dashboard.general-informations'
              : false;
          },
        ),
      resolve: {
        breadcrumb: () => null,

        hosting: /* @ngInject */ ($transition$) =>
          $transition$.params().hosting,

        alerts: /* @ngInject */ ($transition$) => $transition$.params().alerts,

        goBack: /* @ngInject */ ($state) => () =>
          $state.go('app.hosting.dashboard.general-informations'),

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
