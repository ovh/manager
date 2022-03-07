export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.onboarding', {
    url: '/onboarding',
    component: 'managedBaremetalOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
