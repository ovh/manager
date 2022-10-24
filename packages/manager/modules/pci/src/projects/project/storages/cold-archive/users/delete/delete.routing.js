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
      resolve: {
        userId: /* @ngInject */ ($stateParams) => $stateParams.userId,
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
      atInternet: {
        rename:
          'pci::projects::project::storages::objects::s3-policies-users::delete',
      },
    },
  );
};
