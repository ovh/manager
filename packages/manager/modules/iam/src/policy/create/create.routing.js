export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.create', {
    url: '/create',
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policy_create'),
    },
  });
};
