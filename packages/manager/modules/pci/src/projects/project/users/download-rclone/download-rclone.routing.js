import get from 'lodash/get';
import {
  RCLONE_GUIDE,
  DOWNLOAD_TYPE,
  DOWNLOAD_FILENAME,
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '../../../../components/users/download-rclone/download-rclone.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.download-rclone', {
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
          fileName: DOWNLOAD_FILENAME,
          fileType: DOWNLOAD_TYPE,
        };
      },
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        userId,
      ) => PciProjectsProjectUsersService.get(projectId, userId),
      regions: /* @ngInject */ (PciProjectsProjectUsersService, projectId) =>
        PciProjectsProjectUsersService.getStorageRegions(
          projectId,
          REGION_CAPACITY,
        ).then((regions) => regions.map(({ name }) => name)),
      storageS3Regions: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
      ) =>
        PciProjectsProjectUsersService.getS3StorageRegions(
          projectId,
          S3_REGION_CAPACITY,
        ).then((regions) => regions.map(({ name }) => name)),
      rcloneGuide: /* @ngInject */ (coreConfig) => {
        return get(RCLONE_GUIDE, coreConfig.getUser().ovhSubsidiary);
      },
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      downloadRCloneConfig: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        user,
      ) => (regionId, serviceType) =>
        PciProjectsProjectUsersService.downloadRclone(
          projectId,
          user,
          regionId,
          serviceType,
        ),
      checkGlobalRegionCallBack: /* @ngInject */ (
        PciProjectsProjectUsersService,
      ) => (regions) =>
        PciProjectsProjectUsersService.checkGlobalRegion(regions),
    },
  });
};
