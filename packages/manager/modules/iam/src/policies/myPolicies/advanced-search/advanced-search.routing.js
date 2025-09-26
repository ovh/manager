export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.myPolicies.advancedSearch', {
    url: '/advanced-search',
    views: {
      modal: { component: 'iamAdvancedPolicySearch' },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
