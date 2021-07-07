export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.users.delete', {
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
        PciProjectStorageContainersService,
      ) => PciProjectStorageContainersService.getUserDetails(projectId, userId),
      credentials: /* @ngInject */ (
        userId,
        projectId,
        PciProjectStorageContainersService,
      ) =>
        PciProjectStorageContainersService.getS3Credentials(projectId, userId),
      breadcrumb: () => null,
    },
  });
};
