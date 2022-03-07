export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.license.onboarding', {
    url: '/onboarding',
    component: 'licenseOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
