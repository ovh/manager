export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard', {
    url: '/dashboard',
    component: 'iamDashboard',
    redirectTo: 'iam.dashboard.policies',
    resolve: {
      breadcrumb: () => null,
    },
  });

  $stateProvider.state('iam.dashboard.identitiesRedirection', {
    resolve: {
      redirect: /* @ngInject */ (shellClient) =>
        shellClient.navigation.navigateTo('dedicated', '#/useraccount/users'),
    },
  });
};
