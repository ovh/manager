export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy', {
    url: '/policy',
    component: 'iamPolicy',
    redirectTo: 'iam.policy.policies',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
