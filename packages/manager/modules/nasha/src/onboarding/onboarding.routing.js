export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.onboarding', {
    url: '/onboarding',
    component: 'nashaOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
