export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.users', {
    url: '/users',
    views: {
      containersView: 'pciProjectStorageContainersUsers',
    },
    resolve: {
      userList: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
      ) => PciProjectStorageContainersService.getS3Users(projectId),
      goToUsersAndRoles: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.users'),
      goToDeleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('pci.projects.project.storages.objects.users.delete', {
          userId: user.id,
        }),
      goToUsers: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.objects.users',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.storages.objects.users',
            ),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_userlist_username_title',
        ),
    },
  });
};
