export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.onboarding', {
    url: '/onboarding',
    component: 'enterpriseCloudDatabaseOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
