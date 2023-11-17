import { TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners.list', {
    url: '/list',
    views: {
      loadbalancerListenersView: 'octaviaLoadBalancerListenersList',
    },
    resolve: {
      breadcrumb: () => null,
      listeners: /* ngInject */ (
        OctaviaLoadBalancerListenersService,
        projectId,
        region,
        loadbalancerId,
      ) =>
        OctaviaLoadBalancerListenersService.getListeners(
          projectId,
          region,
          loadbalancerId,
        ),
      goToListenerCreation: /* @ngInject */ ($state, trackAction) => () => {
        trackAction('add');
        $state.go('octavia-load-balancer.loadbalancer.listeners.create');
      },
      getListenerEditionLink: /* @ngInject */ ($state) => (listener) =>
        $state.href('octavia-load-balancer.loadbalancer.listeners.edit', {
          listenerId: listener.id,
        }),
      goToListenerEdition: /* @ngInject */ ($state, trackAction) => (
        listener,
      ) => {
        trackAction('edit');
        $state.go('octavia-load-balancer.loadbalancer.listeners.edit', {
          listenerId: listener.id,
        });
      },
      goToListenerDeletion: /* @ngInject */ ($state, trackAction) => (
        listener,
      ) => {
        trackAction('delete');
        $state.go('octavia-load-balancer.loadbalancer.listeners.list.delete', {
          listenerId: listener.id,
          listenerName: listener.name,
        });
      },
      getPoolDetailLink: /* @ngInject */ ($state) => (pool) =>
        $state.href('octavia-load-balancer.loadbalancer.pools.detail', {
          poolId: pool.id,
        }),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
