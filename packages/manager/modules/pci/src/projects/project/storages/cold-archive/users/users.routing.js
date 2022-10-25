import { TRACKING } from './users.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.users', {
    url: '/users',
    component: 'pciProjectStorageColdArchiveUsers',
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
      refreshS3Credentials: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(
          'pci.projects.project.storages.cold-archive.users',
          {
            projectId,
            userDetails: null,
          },
          {
            reload: true,
          },
        );
      },
      goToUsersAndRoles: /* @ngInject */ (
        $state,
        atInternet,
        trackingPrefix,
      ) => () => {
        atInternet.trackClick({
          name: `${trackingPrefix}`,
          type: 'action',
        });
        return $state.go('pci.projects.project.users');
      },
      goToDeleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('pci.projects.project.storages.cold-archive.users.delete', {
          userId: user.id,
        }),
      goToImportPolicy: /* @ngInject */ ($state) => (user) =>
        $state.go(
          'pci.projects.project.storages.cold-archive.users.import-policy',
          {
            userId: user.id,
          },
        ),
      downloadOpenStackRclone: /* @ngInject */ ($state, projectId) => (user) =>
        $state.go(
          'pci.projects.project.storages.cold-archive.users.download-rclone',
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
          'pci.projects.project.storages.cold-archive.users',
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
          name: `${trackingPrefix}${TRACKING.ADD_USER}`,
          type: 'action',
        });
        return $state.go(
          'pci.projects.project.storages.cold-archive.users.add',
        );
      },
      goToUsers: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.storages.cold-archive.users',
          {
            projectId,
            userDetails: null,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.storages.cold-archive.users',
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
