import get from 'lodash/get';
import {
  RCLONE_GUIDE,
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '../../../../../../components/users/download-rclone/download-rclone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.users.download-rclone',
    {
      url: '/rclone/download?userId',
      views: {
        modal: {
          component: 'pciProjectUsersDownloadRclone',
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
          PciStoragesObjectStorageService,
          projectId,
          userId,
        ) => PciStoragesObjectStorageService.get(projectId, userId),
        regions: /* @ngInject */ (PciProject, projectId) =>
          PciProject.getStorageRegions(
            projectId,
            REGION_CAPACITY,
          ).then((regions) => regions.map(({ name }) => name)),
        storageS3Regions: /* @ngInject */ (PciProject, projectId) =>
          PciProject.getS3StorageRegions(
            projectId,
            S3_REGION_CAPACITY,
          ).then((regions) => regions.map(({ name }) => name)),
        rcloneGuide: /* @ngInject */ (coreConfig) => {
          return get(RCLONE_GUIDE, coreConfig.getUser().ovhSubsidiary);
        },
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
        downloadRCloneConfig: /* @ngInject */ (
          PciStoragesObjectStorageService,
          projectId,
          user,
        ) => (regionId, serviceType) =>
          PciStoragesObjectStorageService.downloadRclone(
            projectId,
            user,
            regionId,
            serviceType,
          ),
        checkGlobalRegionCallBack: /* @ngInject */ () => () => null,
      },
    },
  );
};
