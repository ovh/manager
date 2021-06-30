export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects', {
    url: '/objects',
    component: 'pciProjectStorageContainers',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? { state: 'pci.projects.project.storages.objects.onboarding' }
            : { state: 'pci.projects.project.storages.objects.list' },
        ),
    resolve: {
      archive: () => false,
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),
      containerListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.objects.list', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.objects.user-list', {
          projectId,
        }),
      goToStorageContainers: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.objects',
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
              'pci.projects.project.storages.containers',
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
