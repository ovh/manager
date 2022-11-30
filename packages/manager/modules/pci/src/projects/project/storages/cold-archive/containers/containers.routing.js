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
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ARCHIVE, {
            projectId,
            container,
          });
        },

        goToRestoreContainer: /* @ngInject */ ($state, projectId) => (
          container,
        ) => {
          return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_RESTORE, {
            projectId,
            container,
          });
        },

        goToContainerVirtualHost: /* @ngInject */ ($window) => (container) => {
          return $window.open(container.virtualHost, '_blank');
        },

        goBack: /* @ngInject */ (goToColdArchiveContainers) => (
          message = false,
          type = 'success',
        ) => goToColdArchiveContainers(message, type),

        refreshContainers: /* @ngInject */ ($state) => () => $state.reload(),
      },
    },
  );
};
