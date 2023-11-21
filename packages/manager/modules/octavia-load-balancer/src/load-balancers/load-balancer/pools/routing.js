import { DISCOVER_LINK, TRACKING_CHAPTER_1, TRACKING_NAME } from '../constants';
import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools', {
    url: '/pools',
    views: {
      loadbalancerView: 'octaviaLoadBalancerPools',
    },
    resolve: {
      breadcrumb: () => 'pools',
      apiSpecifications: /* @ngInject */ (OctaviaLoadBalancerPoolsService) =>
        OctaviaLoadBalancerPoolsService.getAPISpecifications(),
      algorithms: /* @ngInject */ (apiSpecifications, $translate) =>
        (
          apiSpecifications.models['cloud.loadbalancing.PoolAlgorithmEnum']
            ?.enum || []
        ).map((value) => ({
          label: $translate.instant(
            `octavia_load_balancer_pools_enum_algorithm_${value}`,
          ),
          value,
        })),
      poolProtocols: /* @ngInject */ (apiSpecifications) =>
        apiSpecifications.models['cloud.loadbalancing.PoolProtocolEnum']
          ?.enum || [],
      sessionPersistenceTypes: /* @ngInject */ (
        apiSpecifications,
        $translate,
      ) =>
        (
          apiSpecifications.models[
            'cloud.loadbalancing.PoolSessionPersistenceTypeEnum'
          ]?.enum || []
        ).reduce((acc, value) => {
          if (value !== 'disabled') {
            acc.push({
              label: $translate.instant(
                `octavia_load_balancer_pools_enum_persistent_session_${value}`,
              ),
              value,
            });
          }
          return acc;
        }, []),
      trackBase: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}`,
      discoverOptionsLink: () => DISCOVER_LINK,
      trackAction: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackClick({
          name: `${trackBase}::${hit}`,
          type: 'action',
        }),
      trackPage: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackPage({
          name: `${trackBase}::${hit}`,
        }),
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.pools.list',
  });
};
