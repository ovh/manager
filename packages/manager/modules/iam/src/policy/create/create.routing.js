import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.create', {
    url: '/create',
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policy_create'),
    },
    atInternet: {
      rename: TAG.ADD_POLICY,
    },
  });
};
