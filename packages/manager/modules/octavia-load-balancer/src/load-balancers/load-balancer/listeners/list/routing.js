import { TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';
import { POLICIES_TRACKING } from '../listener/l7/constants';

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
      goToListenerL7Policies: /* @ngInject */ ($state, atInternet) => (
        listener,
      ) => {
        atInternet.trackClick({ name: POLICIES_TRACKING.LIST, type: 'action' });
        $state.go(
          'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
          {
            listenerId: listener.id,
          },
        );
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
      getPoolDetailLinkFromListener: /* @ngInject */ (getPoolDetailLink) => (
        listener,
      ) => getPoolDetailLink(listener.defaultPoolId),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
