import { COLD_ARCHIVE_STATES } from './containers.constants';

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
                  state: COLD_ARCHIVE_STATES.ONBOARDING,
                }
              : false,
          ),
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) => {
          return $translate.instant(
            'pci_projects_project_storages_cold_archive_container_label',
          );
        },

        goToContainer: /* @ngInject */ ($state, projectId) => (container) => {
          const { name } = container;
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER, {
            projectId,
            containerName: name,
          });
        },

        goToAddUserToContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ADD_USER, {
            projectId,
            container,
          });
        },

        goToDeleteContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_DELETE, {
            projectId,
            containerName: name,
          });
        },

        goToDeleteContainerObjects: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          return $state.go(
            COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_OBJECTS_DELETE,
            {
              projectId,
              container,
            },
          );
        },

        goToArchiveContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ARCHIVE, {
            projectId,
            containerName: name,
          });
        },

        goToRestoreContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          const { name } = container;
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_RESTORE, {
            projectId,
            containerName: name,
          });
        },

        goBack: ($state, projectId, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state = COLD_ARCHIVE_STATES.CONTAINERS;

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
