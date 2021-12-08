import { HOSTING_CDN_TERMINATE_HIT_PREFIX } from './hosting-cdn-terminate.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.general-informations.cdn-terminate',
    {
      url: '/cdn/terminate',
      layout: 'modal',
      views: {
        modal: {
          component: 'hostingCdnTerminate',
        },
      },
      params: {
        hosting: null,
        alerts: null,
      },
      redirectTo: (transition) =>
        Promise.all([transition.injector().getAsync('hosting')]).then(
          ([hosting]) => {
            return !hosting
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
            name: `${HOSTING_CDN_TERMINATE_HIT_PREFIX}::${hitPrefix}`,
            type: 'action',
          });
        },
      },
      atInternet: {
        rename: HOSTING_CDN_TERMINATE_HIT_PREFIX,
      },
    },
  );
};
