export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies', {
    url: '/policies',
    component: 'iamPolicies',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies'),
    },
  });
};
