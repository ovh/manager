export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.submit', {
    url: '/submit',
    views: {
      jobView: 'pciProjectTrainingJobsSubmitComponent',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('Submit'),
    },
  });
};
