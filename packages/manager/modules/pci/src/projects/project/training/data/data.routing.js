export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data', {
    url: '/data',
    component: 'pciProjectTrainingDataComponent',
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
      goToData: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.data.list',
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
              'pci.projects.project.training.data.list',
            ),
          );
        }

        return promise;
      },
    },
  });
};
