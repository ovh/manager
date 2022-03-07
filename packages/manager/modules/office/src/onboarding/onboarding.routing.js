export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.onboarding', {
    url: '/onboarding',
    component: 'officeOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
