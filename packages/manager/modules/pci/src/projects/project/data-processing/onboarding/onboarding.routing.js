export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-processing.onboarding', {
    url: '/onboarding',
    component: 'pciProjectDataProcessingOnboardingComponent',
    resolve: {
      goBack: /* @ngInject */ (showJobs) => showJobs,
      breadcrumb: () => null, // Hide breadcrumb,
    },
  });
};
