import { GUIDE } from '../../../iam.constants';
import { MY_POLICIES_TRACKING_HITS } from '../myPolicies.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.myPolicies.create', {
    url: '/create',
    views: {
      '@iam': {
        component: 'iamCreatePolicy',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policy_create'),
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
      rename: MY_POLICIES_TRACKING_HITS.CREATE_POLICY_PAGE,
    },
  });
};
