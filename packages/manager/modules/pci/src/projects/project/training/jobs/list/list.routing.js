export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.list', {
    url: '/',
    component: 'pciProjectTrainingJobsListComponent',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
