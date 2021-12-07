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
        alerts: null,
      },
      resolve: {
        breadcrumb: () => null,

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
