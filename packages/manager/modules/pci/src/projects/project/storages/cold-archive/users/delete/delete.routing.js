import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.users.delete',
    {
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
          userId,
          projectId,
          PciStoragesColdArchiveService,
        ) => PciStoragesColdArchiveService.getS3Credentials(projectId, userId),
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
        breadcrumb: () => null,
      },
    },
  );
};
