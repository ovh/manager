export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-processing.onboarding', {
    url: '/onboarding',
    component: 'dataprocessingOnboardingComponent',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
    },
  });
};
