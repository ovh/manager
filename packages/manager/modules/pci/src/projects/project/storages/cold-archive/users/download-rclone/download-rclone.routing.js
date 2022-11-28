import get from 'lodash/get';
import {
  RCLONE_GUIDE,
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  COLD_ARCHIVE_DEFAULT_REGION,
  COLD_ARCHIVE_STATES,
} from './download-rclone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(`${COLD_ARCHIVE_STATES.S3_USERS_DOWNLOAD_RCLONE}`, {
    url: '/rclone/download?userId',
    views: {
      modal: {
        component: 'pciProjectsProjectStoragesColdArchiveUsersDownloadRclone',
      },
    },
    layout: 'modal',
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
      regions: /* @ngInject */ () => {
        return [COLD_ARCHIVE_DEFAULT_REGION];
      },
      storageS3Regions: /* @ngInject */ () => {
        return [COLD_ARCHIVE_DEFAULT_REGION];
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
