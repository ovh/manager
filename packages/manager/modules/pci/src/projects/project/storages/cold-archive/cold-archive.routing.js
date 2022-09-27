import { COLD_ARCHIVE_TRACKING_PREFIX } from './cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'ovhManagerPciProjectsProjectStoragesColdArchive',
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
      breadcrumb: /* @ngInject */ ($translate) => {
        return $translate.instant(
          'pci_projects_project_storages_cold_archive_title',
        );
      },

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
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: `${COLD_ARCHIVE_TRACKING_PREFIX}::${hit}`,
          type: 'action',
        });
      },
      goToAddColdArchive: /* @ngInject */ ($state) => () => {
        return $state.go('pci.projects.project.storages.cold-archive.add');
      },
      trackPage: /* @ngInject */ (atInternet) => {
        return (hit) => {
          atInternet.trackPage({
            name: `${COLD_ARCHIVE_TRACKING_PREFIX}::${hit}`,
            type: 'action',
          });
        };
      },
    },
  });
};
