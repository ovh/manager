export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.onboarding', {
    url: '/onboarding',
    component: 'emailProOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
