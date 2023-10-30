import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.list.delete',
    {
      url: '/delete?listenerId&listenerName',
      views: {
        modal: {
          component: 'octaviaLoadBalancerListenerDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        listenerId: /* @ngInject */ ($transition$) =>
          $transition$.params().listenerId,
        listenerName: /* @ngInject */ ($transition$) =>
          $transition$.params().listenerName,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.list',
            {},
            reload
              ? { reload: 'octavia-load-balancer.loadbalancer.listeners.list' }
              : null,
          ),
        trackBase: () => `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::delete`,
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
        rename: `${TRACKING_NAME}::delete`,
      },
    },
  );
};
