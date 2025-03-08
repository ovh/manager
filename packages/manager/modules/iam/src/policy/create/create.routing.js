import { TAG, GUIDE } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.create', {
    url: '/create',
    component: 'iamCreatePolicy',
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
      rename: TAG.ADD_POLICY,
    },
  });
};
