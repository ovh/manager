export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.list', {
    url: '/list',
    component: 'pciProjectTrainingJobsListComponent',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
