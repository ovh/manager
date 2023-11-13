import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../constants';
import { TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.delete', {
    url: '/delete?poolId&poolName',
    views: {
      modal: {
        component: 'octaviaLoadBalancerPoolDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
      poolName: /* @ngInject */ ($transition$) =>
        $transition$.params().poolName,
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.pools.list',
          {},
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.pools.list' }
            : null,
        ),
      trackDeleteAction: /* @ngInject */ (trackAction) => (hit) =>
        trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
      trackDeletePage: /* @ngInject */ (trackPage) => (hit) =>
        trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
    },
  });
};
