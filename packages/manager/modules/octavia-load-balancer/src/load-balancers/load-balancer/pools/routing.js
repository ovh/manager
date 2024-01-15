import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../constants';
import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools', {
    url: '/pools',
    views: {
      loadbalancerView: 'octaviaLoadBalancerPools',
    },
    resolve: {
      breadcrumb: () => 'pools',
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
        ).map((value) => ({
          label: $translate.instant(
            `octavia_load_balancer_pools_enum_persistent_session_${value}`,
          ),
          value,
        })),
      trackBase: () =>
        `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}`,
      goToPoolEdition: /* @ngInject */ ($state) => (pool) =>
        $state.go('octavia-load-balancer.loadbalancer.pools.edit', {
          poolId: pool.id,
        }),
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
