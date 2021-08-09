export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object.addUser',
    {
      url: '/addUser',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerAddUser',
        },
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('availableUsers')
          .then((availableUsers) =>
            availableUsers.length === 0
              ? {
                  state:
                    'pci.projects.project.storages.object-storage.objects.object.emptyUser',
                }
              : false,
          ),
      layout: 'modal',
      params: {
        objectKey: null,
      },
      resolve: {
        objectKey: /* @ngInject */ ($transition$) =>
          $transition$.params().objectKey,
        availableUsers: /* @ngInject */ (
          PciStoragesObjectStorageService,
          projectId,
        ) => PciStoragesObjectStorageService.getS3Users(projectId),
        goToUsersAndRoles: /* @ngInject */ ($state) => () =>
          $state.go('pci.projects.project.users'),
        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
    },
  );
};
