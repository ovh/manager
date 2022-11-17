export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.containers',
    {
      url: '/containers',
      component: 'pciProjectStorageColdArchiveContainers',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containers')
          .then((containers) =>
            containers.length === 0
              ? {
                  state:
                    'pci.projects.project.storages.cold-archive.onboarding',
                }
              : false,
          ),
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) => {
          return $translate.instant(
            'pci_projects_project_storages_cold_archive_container_label',
          );
        },
        goToDeleteContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(
            'pci.projects.project.storages.cold-archive.containers.delete',
            {
              projectId,
              containerName: name,
            },
          );
        },
        goToArchiveContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(
            'pci.projects.project.storages.cold-archive.containers.archive',
            {
              projectId,
              containerName: name,
            },
          );
        },
        goToRestoreContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(
            'pci.projects.project.storages.cold-archive.containers.restore',
            {
              projectId,
              containerName: name,
            },
          );
        },
        goBack: ($state, projectId, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state = 'pci.projects.project.storages.cold-archive.containers';

          const promise = $state.go(
            state,
            {
              projectId,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() => CucCloudMessage[type](message, state));
          }

          return promise;
        },

        refreshContainers: /* @ngInject */ ($state) => () => $state.reload(),
      },
    },
  );
};
