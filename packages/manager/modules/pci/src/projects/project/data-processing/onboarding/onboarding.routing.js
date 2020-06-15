export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-processing.onboarding', {
    url: '/onboarding',
    component: 'pciProjectDataProcessingOnboarding',
    resolve: {
      goBack: /* @ngInject */ (showJobs) => showJobs,
      breadcrumb: () => null, // Hide breadcrumb,
    },
    atInternet: {
      name: 'public-cloud::pci::projects::project::data-processing::onboarding',
    },
  });
};
