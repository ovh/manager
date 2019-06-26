export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.onboarding', {
    url: '/onboarding',
    component: 'onboardingComponent',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
