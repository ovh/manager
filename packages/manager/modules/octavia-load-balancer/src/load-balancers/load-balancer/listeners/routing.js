import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners', {
    url: '/listeners',
    views: {
      loadbalancerView: 'octaviaLoadBalancerListeners',
    },
    resolve: {
      breadcrumb: () => 'listeners',
      trackBase: /* @ngInject */ (trackRoot) =>
        `${trackRoot}::${TRACKING_SUFFIX}`,
      trackAction: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackClick({
          name: `${trackBase}::${hit}`,
          type: 'action',
        }),
      trackPage: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackPage({
          name: `${trackBase}::${hit}`,
        }),
      getPoolDetailLink: /* @ngInject */ (
        coreURLBuilder,
        projectId,
        region,
        loadbalancerId,
      ) => (poolId) =>
        coreURLBuilder.buildURL(
          'public-cloud',
          '#/pci/projects/:serviceName/octavia-load-balancer/:region/:loadbalancerId/pools/:poolId',
          {
            serviceName: projectId,
            region,
            loadbalancerId,
            poolId,
          },
        ),
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.listeners.list',
  });
};
