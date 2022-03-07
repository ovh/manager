export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.onboarding', {
    url: '/onboarding',
    views: {
      vpsContainer: 'vpsOnboardingComponent',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
