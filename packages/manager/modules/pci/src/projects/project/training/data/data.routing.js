export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data', {
    url: '/data',
    component: 'pciProjectTrainingDataComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_data_title'),
      dataList: /* @ngInject */ (PciProjectTrainingDataService, projectId) =>
        PciProjectTrainingDataService.getAll(projectId),
      data: /* @ngInject */ (PciProjectTrainingDataService, projectId) => (
        dataId,
      ) => PciProjectTrainingDataService.get(projectId, dataId),
      addDataLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.data.add', {
          projectId,
        }),
      dataSync: /* @ngInject */ ($state, projectId) => (dataId) =>
        $state.go('pci.projects.project.training.data.sync', {
          projectId,
          dataId,
        }),
      goToContainer: /* @ngInject */ ($state, projectId) => (containerId) =>
        $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId,
        }),
      goToData: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.data',
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
              'pci.projects.project.training.data',
            ),
          );
        }

        return promise;
      },
    },
  });
};
