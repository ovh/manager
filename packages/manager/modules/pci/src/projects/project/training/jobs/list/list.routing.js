export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.list', {
    url: '/list',
    views: {
      jobView: 'pciProjectTrainingJobsListComponent',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
