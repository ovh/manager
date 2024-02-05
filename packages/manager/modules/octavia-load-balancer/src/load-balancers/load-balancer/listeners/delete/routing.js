import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../constants';
import { TRACKING_NAME } from '../../constants';

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
        trackDeleteAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
        trackDeletePage: /* @ngInject */ (trackPage) => (hit) =>
          trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
