import { TRACKING_HIT_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.members.list.create',
    {
      url: '/create',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailMembersCreate',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.members.list',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.pools.detail.members.list',
                }
              : null,
          ),
        trackCreateAction: /* @ngInject */ (trackAction) => (hit) =>
          trackAction(`${TRACKING_HIT_PREFIX}::add-${hit}`),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
