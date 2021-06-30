export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.list', {
    url: '/list',
    views: {
      containersView: 'pciProjectStorageContainersList',
    },
    resolve: {
      archive: () => false,
      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.objects.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: container.id,
        }),
      deleteContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.objects.list.delete', {
          projectId,
          containerId: container.id,
        }),
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: container.id,
        }),

      goToStorageContainers: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.objects.list',
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
              'pci.projects.project.storages.obects',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_object_title',
        ),
    },
  });
};
