export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.createPolicy', {
    url: '/policy/create',
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policy_create'),
    },
  });
};
