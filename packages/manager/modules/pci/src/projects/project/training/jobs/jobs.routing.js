export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs', {
    url: '/jobs',
    component: 'pciProjectTrainingJobsComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_title'),
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId) => (
        jobId,
      ) => PciProjectTrainingJobService.get(projectId, jobId),
      getPrice: /* @ngInject */ (pricesCatalog) => (qty) =>
        pricesCatalog[`ai-serving-engine.ml1-c-xl.hour.consumption`]
          .priceInUcents * qty,
      getTax: /* @ngInject */ (pricesCatalog) => (qty) =>
        pricesCatalog[`ai-serving-engine.ml1-c-xl.hour.consumption`].tax * qty,
      goToJobs: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.jobs',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.training.jobs',
            ),
          );
        }

        return promise;
      },
    },
  });
};
