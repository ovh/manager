import get from 'lodash/get';
import { RCLONE_GUIDE } from './download-rclone.constants';

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
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        userId,
      ) => PciProjectsProjectUsersService.get(projectId, userId),
      regions: /* @ngInject */ (PciProjectsProjectUsersService, projectId) =>
        PciProjectsProjectUsersService.getStorageRegions(
          projectId,
        ).then((regions) => regions.map(({ name }) => name)),
      rcloneGuide: /* @ngInject */ (SessionService) =>
        SessionService.getUser().then(({ ovhSubsidiary }) =>
          get(RCLONE_GUIDE, ovhSubsidiary),
        ),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
    },
  });
};
