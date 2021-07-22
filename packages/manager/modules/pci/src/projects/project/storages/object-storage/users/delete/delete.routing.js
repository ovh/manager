export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.containers.users.delete',
    {
      url: '/delete?userId',
      views: {
        modal: {
          component: 'pciProjectStoragesContainersUsersDeleteComponent',
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
