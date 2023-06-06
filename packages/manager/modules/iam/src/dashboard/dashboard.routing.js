export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard', {
    url: '/dashboard',
    component: 'iamDashboard',
    redirectTo: 'iam.dashboard.policies',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
