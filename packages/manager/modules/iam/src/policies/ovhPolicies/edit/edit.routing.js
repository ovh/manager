import { GUIDE } from '../../../iam.constants';
import { OVH_POLICIES_TRACKING_HITS } from '../ovhPolicies.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.ovhPolicies.edit', {
    url: '/edit/{policy:uuid}',
    views: {
      '@iam': {
        component: 'iamCreatePolicy',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ (policy) => policy.name,
      /**
       * The Policy parameter based on the policy's id
       * @returns {Object|null}
       */
      policy: /* @ngInject */ ($transition$, IAMService) => {
        const { policy: uuid } = $transition$.params();
        return uuid ? IAMService.getDetailedPolicy(uuid) : null;
      },

      /**
       * Retrieve the list of permissionsGroups
       * @returns {Object|null}
       */
      permissionsGroups: /* @ngInject */ (IAMService) =>
        IAMService.getPermissionsGroups(),
      policiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(GUIDE.IAM);
      },
    },
    atInternet: {
      rename: OVH_POLICIES_TRACKING_HITS.EDIT_POLICY_PAGE,
    },
  });
};
