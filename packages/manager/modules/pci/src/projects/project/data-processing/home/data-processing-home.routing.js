export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.home', {
    url: '/home',
    component: 'pciProjectDataProcessingHome',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      submitJob: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.data-processing.jobs.submit-job', {
          projectId,
        }),
      showJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.data-processing.jobs', { projectId }),
    },
    atInternet: {
      rename: 'public-cloud::pci::projects::project::data-processing',
    },
  });
