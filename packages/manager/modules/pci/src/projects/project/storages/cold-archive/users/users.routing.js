import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.S3_USERS, {
    url: '/users',
    component: 'pciProjectStorageColdArchiveUsers',
    params: {
      userDetails: null,
      userCredential: null,
      trackingInfo: null,
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.USER.MAIN}`,
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
          COLD_ARCHIVE_STATES.S3_USERS,
          {
            projectId,
            userDetails: null,
          },
          {
            reload: true,
          },
        );
      },
      goToUsersAndRoles: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.users'),
      goToDeleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go(COLD_ARCHIVE_STATES.S3_USERS_DELETE, {
          userId: user.id,
        }),
      goToImportPolicy: /* @ngInject */ ($state) => (user) =>
        $state.go(COLD_ARCHIVE_STATES.S3_USERS_IMPORT_POLICY, {
          userId: user.id,
        }),
      downloadOpenStackRclone: /* @ngInject */ ($state, projectId) => (user) =>
        $state.go(COLD_ARCHIVE_STATES.S3_USERS_DOWNLOAD_RCLONE, {
          projectId,
          userId: user.id,
        }),
      goToUsersBanner: /* @ngInject */ ($state, projectId) => (
        reload = false,
        userDetails,
        userCredential,
        trackingInfo,
      ) => {
        return $state.go(
          COLD_ARCHIVE_STATES.S3_USERS,
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
      goToAddUser: /* @ngInject */ ($state) => () => {
        return $state.go(COLD_ARCHIVE_STATES.S3_USERS_ADD);
      },
      goToUsers: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          COLD_ARCHIVE_STATES.S3_USERS,
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
            CucCloudMessage[type](message, COLD_ARCHIVE_STATES.S3_USERS),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_s3_users_label',
        ),
    },
  });
};
