import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_SUFFIX as L7_TRACKING_SUFFIX } from '../constants';
import { L7_RULES_LISTING_TRACKING_SUFFIX, TRACKING_SUFFIX } from './constants';
import { TRACKING_SUFFIX as EDITION_TRACKING_SUFFIX } from '../edit/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
    {
      url: '/list',
      views: {
        loadbalancerL7View: 'octaviaLoadBalancerL7PoliciesList',
      },
      resolve: {
        breadcrumb: () => null,
        policies: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          listenerId,
        ) =>
          OctaviaLoadBalancerL7Service.getPolicies(
            projectId,
            region,
            listenerId,
          ),
        goToL7PolicyCreation: /* @ngInject */ ($state, trackL7Action) => () => {
          trackL7Action('create');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.create',
          );
        },
        goToL7PolicyEdition: /* @ngInject */ ($state, trackL7Action) => (
          policy,
        ) => {
          trackL7Action(EDITION_TRACKING_SUFFIX);
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
            {
              policyId: policy.id,
            },
          );
        },
        getL7PolicyEditionLink: /* @ngInject */ ($state) => (policy) =>
          $state.href(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
            {
              policyId: policy.id,
            },
          ),
        goToL7Rules: /* @ngInject */ ($state, trackL7Action) => (policy) => {
          trackL7Action(L7_RULES_LISTING_TRACKING_SUFFIX);
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list',
            {
              policyId: policy.id,
            },
          );
        },
        getPoolDetailLinkFromPolicy: /* @ngInject */ (getPoolDetailLink) => (
          policy,
        ) => getPoolDetailLink(policy.redirectPoolId),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TRACKING_SUFFIX}::${L7_TRACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
