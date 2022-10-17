import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  GUIDES,
} from './cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive?id',
    component: 'pciProjectStorageContainers',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state: 'pci.projects.project.storages.cold-archive.onboarding',
              }
            : false,
        ),
    resolve: {
      coldArchive: () => true,
      guides: () => GUIDES,
      breadcrumb: /* @ngInject */ ($translate) => {
        return $translate.instant(
          'pci_projects_project_storages_cold_archive_title',
        );
      },

      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.cold-archives.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.cold-archives.cold-archive', {
          projectId,
          containerId: container.id,
        }),
      deleteContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.cold-archives.delete', {
          projectId,
          containerId: container.id,
        }),
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href(
          'pci.projects.project.storages.cold-archives.cold-archive',
          {
            projectId,
            containerId: container.id,
          },
        ),

      userList: /* @ngInject */ (projectId, allUserList) =>
        allUserList.filter((user) => user?.s3Credentials?.length > 0),

      allUserList: /* @ngInject */ (
        projectId,
        PciStoragesObjectStorageService,
      ) =>
        PciStoragesObjectStorageService.getAllS3Users(projectId).then((users) =>
          PciStoragesObjectStorageService.mapUsersToCredentials(
            projectId,
            users,
          ),
        ),

      goToArchives: ($state, projectId, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.storages.cold-archive';

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

      containers: /* @ngInject */ (PciStoragesColdArchiveService, projectId) =>
        PciStoragesColdArchiveService.getAllColdArchives(projectId),

      goToAddColdArchive: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.storages.cold-archive.add'),

      trackClick: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackClick({
          name: `${COLD_ARCHIVE_TRACKING_PREFIX}::${hit}`,
          type: 'action',
        }),

      trackPage: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackPage({
          name: `${COLD_ARCHIVE_TRACKING_PREFIX}::${hit}`,
          type: 'action',
        }),
    },
  });
};
