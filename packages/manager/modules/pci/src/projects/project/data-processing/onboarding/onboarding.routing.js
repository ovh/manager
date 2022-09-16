export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-processing.onboarding', {
    url: '/onboarding',
    views: {
      'content@pci.projects.project.data-processing':
        'pciProjectDataProcessingOnboarding',
    },
    resolve: {
      goBack: /* @ngInject */ (showJobs) => showJobs,
      breadcrumb: () => null, // Hide breadcrumb,
      showJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.jobs',
          { projectId },
          {
            reload: true,
          },
        ),
    },
    atInternet: {
      name: 'public-cloud::pci::projects::project::data-processing::onboarding',
    },
  });
};
