export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.containers', {
    url: '/containers',
    component: 'pciProjectStorageObjectStorage',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state:
                  'pci.projects.project.storages.containers.objects.onboarding',
              }
            : { state: 'pci.projects.project.storages.containers.objects' },
        ),
    resolve: {
      archive: () => false,
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),
      containersLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.containers.objects', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.containers.users', {
          projectId,
        }),
      goToStorageContainers: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.containers.objects',
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

      breadcrumb: () => null,
    },
  });
};
