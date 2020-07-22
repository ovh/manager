export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data', {
    url: '/data',
    views: {
      trainingView: 'pciProjectTrainingDataComponent',
    },
    redirectTo: {
      state: 'pci.projects.project.training.data.list',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('Data'),
      dataList: /* @ngInject */ (PciProjectTrainingDataService, projectId) =>
        PciProjectTrainingDataService.getAll(projectId),
      data: /* @ngInject */ (PciProjectTrainingDataService, projectId) => (
        jobId,
      ) => PciProjectTrainingDataService.get(projectId, jobId),
      dataInfo: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.data.info', {
          projectId,
          jobId,
        }),
      addDataLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.data.add', {
          projectId,
        }),
      attachData: /* @ngInject */ (
        PciProjectTrainingDataService,
        $state,
        projectId,
      ) => (dataSpec) =>
        PciProjectTrainingDataService.attach(projectId, dataSpec).then(() => {
          $state.go(
            'pci.projects.project.training.data.list',
            {
              projectId,
            },
            {
              reload: true,
            },
          );
        }),
    },
  });
};
