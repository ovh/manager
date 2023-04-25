import {
  RCLONE_GUIDE,
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
} from './download-rclone.constants';
import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.S3_USERS_DOWNLOAD_RCLONE, {
    url: '/rclone/download?userId',
    views: {
      modal: {
        component: 'pciProjectsProjectStoragesColdArchiveUsersDownloadRclone',
      },
    },
    layout: 'modal',
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}`,
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      file: /* @ngInject */ () => {
        return {
          fileName: DOWNLOAD_RCLONE_FILENAME,
          fileType: DOWNLOAD_RCLONE_FILETYPE,
        };
      },
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciStoragesColdArchiveService,
        projectId,
        userId,
      ) => PciStoragesColdArchiveService.get(projectId, userId),

      storageS3Regions: /* @ngInject */ (regions) => {
        return regions;
      },
      rcloneGuide: /* @ngInject */ (coreConfig) => {
        return (
          RCLONE_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
          RCLONE_GUIDE.DEFAULT
        );
      },
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      downloadRCloneConfig: /* @ngInject */ (
        PciStoragesColdArchiveService,
        projectId,
        user,
      ) => (regionId, serviceType) =>
        PciStoragesColdArchiveService.downloadRclone(
          projectId,
          user,
          regionId,
          serviceType,
        ),
      checkGlobalRegionCallBack: /* @ngInject */ () => () => null,
    },
  });
};
