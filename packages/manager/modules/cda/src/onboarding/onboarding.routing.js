export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.onboarding', {
    url: '/onboarding',
    views: {
      cdaDetails: {
        component: 'cdaOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
