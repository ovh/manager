export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.users.add', {
    url: '/new',
    views: {
      modal: {
        component: 'pciProjectColdArchiveUsersAdd',
      },
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
    atInternet: {
      rename:
        'pci::projects::project::storages::objects::s3-policies-users::add',
    },
  });
};
