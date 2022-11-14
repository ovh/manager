import {
  COLD_ARCHIVE_TRACKING_PREFIX,
  CHECK_PRICES_DOC_LINK,
  REGION,
  GUIDES,
} from './cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'pciProjectStorageColdArchive',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state: 'pci.projects.project.storages.cold-archive.onboarding',
              }
            : {
                state: 'pci.projects.project.storages.cold-archive.containers',
              },
        ),
    resolve: {
      guides: () => GUIDES,

      priceLink: /* @ngInject */ (coreConfig) =>
        CHECK_PRICES_DOC_LINK[coreConfig.getUser().ovhSubsidiary] ||
        CHECK_PRICES_DOC_LINK.DEFAULT,

      breadcrumb: /* @ngInject */ ($translate) => {
        return $translate.instant(
          'pci_projects_project_storages_cold_archive_label',
        );
      },

      trackingPrefix: () =>
        'PublicCloud::pci::projects::project::storages::cold_archive::',

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

      goToColdArchiveContainers: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.cold-archive', {
          projectId,
        }),

      goToColdArchiveContainersWithMessage: (
        $state,
        projectId,
        CucCloudMessage,
      ) => (message = false, type = 'success') => {
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

      goToAddColdArchive: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.cold-archive.add', {
          projectId,
        }),

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

      scrollToTop: /* @ngInject */ ($anchorScroll, $location) => () => {
        $location.hash('cold-archive-header');
        $anchorScroll();
      },
    },
  });
};
