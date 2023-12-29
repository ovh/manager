export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.onboarding', {
    url: '/onboarding',
    component: 'dedicatedServerOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
