import {
  COLD_ARCHIVE_STATES,
  COLD_ARCHIVE_TRACKING,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINERS_CONTAINER_MANAGE, {
    url: '/manage',
    views: {
      modal: {
        component: 'pciStoragesColdArchiveContainersManageContainer',
      },
    },
    layout: 'modal',
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER}`,
    },
    resolve: {
      breadcrumb: () => null,
      endpoint: /* @ngInject */ (
        PciStoragesColdArchiveService,
        projectId,
        regions,
      ) =>
        PciStoragesColdArchiveService.getArchiveRegionDetails(
          projectId,
          regions[0],
        )
          .then(({ data }) => data?.services[0]?.endpoint)
          .catch(() => ''),
    },
  });
};
