import { TRACKING_NAME, TRACKING_CHAPTER_1 } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.general-information.edit-name',
    {
      url: '/edit-name',
      views: {
        modal: {
          component: 'octaviaLoadBalancerEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.general-information',
            {},
            reload ? { reload: 'octavia-load-balancer.loadbalancer' } : null,
          ),
        trackBase: () => `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::rename`,
        trackAction: /* @ngInject */ (atInternet, trackBase) => (hit) =>
          atInternet.trackClick({
            name: `${trackBase}::${hit}`,
            type: 'action',
          }),
        trackPage: /* @ngInject */ (atInternet, trackBase) => (hit) =>
          atInternet.trackPage({
            name: `${trackBase}-${hit}`,
          }),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::rename`,
      },
    },
  );
};
