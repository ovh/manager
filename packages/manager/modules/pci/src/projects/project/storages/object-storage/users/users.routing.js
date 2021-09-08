export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.users', {
    url: '/users',
    views: {
      containersView: 'pciProjectStorageObjectStorageUsers',
    },
    resolve: {
      userList: /* @ngInject */ (PciStoragesObjectStorageService, projectId) =>
        PciStoragesObjectStorageService.getS3Users(projectId),
      goToUsersAndRoles: /* @ngInject */ (
        $state,
        atInternet,
        trackingPrefix,
      ) => () => {
        atInternet.trackClick({
          name: `${trackingPrefix}s3-policies-users::add`,
          type: 'action',
        });
        return $state.go('pci.projects.project.users');
      },
      goToDeleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('pci.projects.project.storages.object-storage.users.delete', {
          userId: user.id,
        }),
      goToImportPolicy: /* @ngInject */ ($state) => (user) =>
        $state.go(
          'pci.projects.project.storages.object-storage.users.import-policy',
          {
            userId: user.id,
          },
        ),
      goToUsers: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.object-storage.users',
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
              'pci.projects.project.storages.object-storage.users',
            ),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_s3_users_label',
        ),
    },
    atInternet: {
      rename: 'pci::projects::project::storages::objects::s3-policies-users',
    },
  });
};
