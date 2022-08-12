export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.users', {
    url: '/users',
    component: 'pciProjectStorageObjectStorageUsers',
    params: {
      userDetails: null,
      userCredential: null,
      trackingInfo: null,
    },
    resolve: {
      userDetails: /* @ngInject */ ($transition$) =>
        $transition$.params().userDetails,
      userCredential: /* @ngInject */ ($transition$) =>
        $transition$.params().userCredential,
      trackingInfo: /* @ngInject */ ($transition$) =>
        $transition$.params().trackingInfo,
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
      downloadOpenStackRclone: /* @ngInject */ ($state, projectId) => (user) =>
        $state.go(
          'pci.projects.project.storages.object-storage.users.download-rclone',
          {
            projectId,
            userId: user.id,
          },
        ),
      goToUsersBanner: /* @ngInject */ ($state, projectId) => (
        reload = false,
        userDetails,
        userCredential,
        trackingInfo,
      ) => {
        return $state.go(
          'pci.projects.project.storages.object-storage.users',
          {
            projectId,
            userDetails,
            userCredential,
            trackingInfo,
          },
          {
            reload,
          },
        );
      },
      goToAddUser: /* @ngInject */ (
        $state,
        atInternet,
        trackingPrefix,
      ) => () => {
        atInternet.trackClick({
          name: `${trackingPrefix}s3-policies-users::add`,
          type: 'action',
        });
        return $state.go(
          'pci.projects.project.storages.object-storage.users.add',
        );
      },
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
      ignore: true,
    },
  });
};
