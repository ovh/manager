export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage', {
    url: '/objects',
    component: 'pciProjectStorageObjectStorage',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state:
                  'pci.projects.project.storages.object-storage.onboarding',
              }
            : { state: 'pci.projects.project.storages.object-storage.objects' },
        ),
    resolve: {
      archive: () => false,
      trackingPrefix: () =>
        'PublicCloud::pci::projects::project::storages::objects::',
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),
      containersLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.object-storage.objects', {
          projectId,
        }),
      isUserTabActive: /* @ngInject */ ($transition$, $state) => () => {
        return $state
          .href($state.current.name, $transition$.params())
          .includes('users');
      },
      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.object-storage.users', {
          projectId,
        }),
      onGuideLinkClick: /* @ngInject */ (atInternet, trackingPrefix) => () =>
        atInternet.trackClick({
          name: `${trackingPrefix}onboarding::documentation::object_guide`,
          type: 'action',
        }),
      goToStorageContainers: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.object-storage.objects',
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
