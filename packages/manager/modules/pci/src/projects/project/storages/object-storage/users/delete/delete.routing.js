export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.users.delete',
    {
      url: '/:userId/delete',
      views: {
        modal: {
          component: 'pciProjectStoragesObjectStorageUsersDeleteComponent',
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
          PciStoragesObjectStorageService,
        ) => PciStoragesObjectStorageService.getUserDetails(projectId, userId),
        credentials: /* @ngInject */ (
          userId,
          projectId,
          PciStoragesObjectStorageService,
        ) =>
          PciStoragesObjectStorageService.getS3Credentials(projectId, userId),
        breadcrumb: () => null,
      },
    },
  );
};
