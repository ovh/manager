import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.users.add', {
    url: '/new',
    views: {
      modal: {
        component: 'pciProjectColdArchiveUsersAdd',
      },
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PREFIX}::${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}`,
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      cancel: /* @ngInject */ (goToUsers) => goToUsers,
      goBack: /* @ngInject */ (goToUsersBanner) => goToUsersBanner,
      usersCredentials: /* @ngInject */ (
        projectId,
        allUserList,
        PciStoragesUsersService,
      ) =>
        PciStoragesUsersService.getUsersCredentials(
          projectId,
          allUserList.filter((user) => user),
        ),
    },
  });
};
