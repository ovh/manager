import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.S3_USERS_DELETE, {
    url: '/:userId/delete',
    views: {
      modal: {
        component: 'pciProjectStoragesColdArchiveUsersDeleteComponent',
      },
    },
    layout: 'modal',
    params: {
      userId: null,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY}`,
    },
    resolve: {
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        projectId,
        userId,
        PciStoragesColdArchiveService,
      ) => PciStoragesColdArchiveService.getUserDetails(projectId, userId),
      credentials: /* @ngInject */ (
        projectId,
        userId,
        PciStoragesColdArchiveService,
      ) => PciStoragesColdArchiveService.getS3Credentials(projectId, userId),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      breadcrumb: () => null,
    },
  });
};
