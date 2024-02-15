import {
  TRACKING_CHAPTER_1,
  TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX,
} from '../octavia-load-balancer.constants';
import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancers.delete', {
    url: '/delete?loadBalancerId&loadBalancerName&loadBalancerRegion',
    views: {
      modal: {
        component: 'octaviaLoadBalancerDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      loadBalancerId: /* @ngInject */ ($transition$) =>
        $transition$.params().loadBalancerId,
      loadBalancerRegion: /* @ngInject */ ($transition$) =>
        $transition$.params().loadBalancerRegion,
      loadBalancerName: /* @ngInject */ ($transition$) =>
        $transition$.params().loadBalancerName,
      trackingDeletionBase: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}::${TRACKING_SUFFIX}`,
      trackDeletionAction: /* @ngInject */ (
        atInternet,
        trackingDeletionBase,
      ) => (hit) =>
        atInternet.trackClick({
          name: `${trackingDeletionBase}::${hit}`,
          type: 'action',
        }),
      trackDeletionPage: /* @ngInject */ (atInternet, trackingDeletionBase) => (
        hit,
      ) =>
        atInternet.trackPage({
          name: `${trackingDeletionBase}-${hit}`,
        }),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancers',
          {},
          reload ? { reload: 'octavia-load-balancer.loadbalancers' } : null,
        ),
    },
    atInternet: {
      rename: `${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}::delete`,
    },
  });
};
