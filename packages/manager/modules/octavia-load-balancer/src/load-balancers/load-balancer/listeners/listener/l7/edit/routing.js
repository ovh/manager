import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_SUFFIX as L7_TRACKING_SUFFIX } from '../constants';
import { TRACKING_SUFFIX, UNAVAILABLE_POOL_PROTOCOLS } from './constants';
import { LISTENER_POOL_PROTOCOL_COMBINATION } from '../../../components/listener-form/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
    {
      url: '/:policyId/edit',
      views: {
        loadbalancerL7View: 'octaviaLoadBalancerL7Edit',
      },
      resolve: {
        breadcrumb: () => null,
        redirectHttpCodes: /* @ngInject */ (apiSpecifications) =>
          apiSpecifications.models[
            'cloud.loadbalancing.L7PolicyRedirectHTTPCodeEnum'
          ]?.enum,
        policyId: /* @ngInject */ ($transition$) =>
          $transition$.params().policyId,
        policy: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          policyId,
        ) =>
          OctaviaLoadBalancerL7Service.getPolicy(projectId, region, policyId),
        pools: /* @ngInject */ (
          OctaviaLoadBalancerPoolsService,
          projectId,
          region,
          loadbalancerId,
          listener,
        ) =>
          OctaviaLoadBalancerPoolsService.getPools(
            projectId,
            region,
            loadbalancerId,
          ).then((pools) =>
            pools.filter(
              (pool) =>
                !UNAVAILABLE_POOL_PROTOCOLS.includes(pool.protocol) &&
                LISTENER_POOL_PROTOCOL_COMBINATION[listener.protocol].includes(
                  pool.protocol,
                ),
            ),
          ),
        trackL7EditPolicyBase: /* @ngInject */ (trackL7Base) =>
          `${trackL7Base}::${TRACKING_SUFFIX}`,
        trackL7EditPolicyAction: /* @ngInject */ (
          atInternet,
          trackL7EditPolicyBase,
        ) => (hit) =>
          atInternet.trackClick({
            name: `${trackL7EditPolicyBase}::${hit}`,
            type: 'action',
          }),
        trackL7EditPolicyPage: /* @ngInject */ (
          atInternet,
          trackL7EditPolicyBase,
        ) => (hit) =>
          atInternet.trackPage({
            name: `${trackL7EditPolicyBase}-${hit}`,
          }),
        goBackToL7PoliciesList: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
                }
              : null,
          ),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TRACKING_SUFFIX}::${L7_TRACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
