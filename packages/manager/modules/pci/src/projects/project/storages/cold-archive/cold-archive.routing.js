import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  REGION,
} from './cold-archives.constants';

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

      trackingPrefix: () =>
        'PublicCloud::pci::projects::project::storages::cold_archive::',

      userList: /* @ngInject */ (projectId, allUserList) =>
        allUserList.filter((user) => user?.s3Credentials?.length > 0),

      allUserList: /* @ngInject */ (projectId, PciStoragesColdArchiveService) =>
        PciStoragesColdArchiveService.getAllS3Users(projectId).then((users) =>
          PciStoragesColdArchiveService.mapUsersToCredentials(projectId, users),
        ),

      isUserTabActive: /* @ngInject */ ($transition$, $state) => () =>
        $state.is(
          'pci.projects.project.storages.cold-archive.users',
          $transition$.params(),
        ),

      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.cold-archive.users', {
          projectId,
        }),

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

      // The region parameter is for now hard-coded.
      // waiting the API fix https://projects.dsi.ovh/browse/PCINT-3514
      containers: /* @ngInject */ (PciStoragesColdArchiveService, projectId) =>
        PciStoragesColdArchiveService.getArchiveContainers(projectId, REGION),

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
