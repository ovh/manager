import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS, {
    url: '',
    component: 'pciProjectStorageColdArchiveContainers',
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}`,
    },
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
    params: {
      createdContainerInfos: null,
    },
    resolve: {
      breadcrumb: () => null,

      goToContainer: /* @ngInject */ ($state, projectId) => (container) => {
        const { name } = container;
        return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER, {
          projectId,
          containerName: name,
        });
      },

      createdContainerInfos: /* @ngInject */ ($transition$) =>
        $transition$.params().createdContainerInfos,

      goToManageContainer: /* @ngInject */ ($state) => () =>
        $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_MANAGE, {}),

      goToAddUserToContainer: /* @ngInject */ ($state, projectId) => (
        container,
      ) => {
        return $state.go(
          COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ADD_USER,
          {
            projectId,
            container,
          },
          { inherit: false },
        );
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

      goToDeleteContainer: /* @ngInject */ ($state, projectId) => (
        container,
      ) => {
        return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_DELETE, {
          projectId,
          container,
        });
      },

      goToFlushArchive: /* @ngInject */ ($state, projectId) => (container) => {
        return $state.go(COLD_ARCHIVE_STATES.CONTAINERS_ARCHIVE_FLUSH, {
          projectId,
          container,
        });
      },

      goToDeleteArchive: /* @ngInject */ ($state, projectId) => (container) => {
        return $state.go(
          COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_ARCHIVE_DELETE,
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

      goToEditRetentionContainer: /* @ngInject */ ($state, projectId) => (
        container,
      ) => {
        return $state.go(
          COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_EDIT_RETENTION,
          {
            projectId,
            container,
          },
        );
      },

      goBack: /* @ngInject */ (goToColdArchiveContainers) => (
        message = false,
        type = 'success',
      ) => goToColdArchiveContainers(message, type),

      refreshContainers: /* @ngInject */ ($state) => () => $state.reload(),
    },
  });
};
