export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users', {
    url: '/users',
    reloadOnSearch: false,
    views: {
      pccView: 'dedicatedCloudUsers',
    },
    resolve: {
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
        reload = undefined,
      ) => {
        return goBackToState(
          'app.dedicatedCloud.details.users',
          message,
          type,
          reload,
        );
      },
      addUser: /* @ngInject */ ($state) => (passwordPolicy) =>
        $state.go('app.dedicatedCloud.details.users.add', {
          passwordPolicy,
        }),
      deleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.delete', {
          userId: user.userId,
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.user.disable', {
          userId: user.userId,
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.edit', {
          user,
          userId: user.userId,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.user.enable', {
          userId: user.userId,
          user,
        }),
      goToAddFederation: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.users.federation-add'),
      goToImportUser: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.users.import'),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.dedicatedCloud.details.users.user.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.dedicatedCloud.details.users.password-reset', {
          userId: user.userId,
          passwordPolicy,
          user,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_users'),
    },
  });

  $stateProvider.state('app.dedicatedCloud.details.users.user', {
    url: '/:userId',
    redirectTo: 'app.dedicatedCloud.details.users',
    resolve: {
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      breadcrumb: /* @ngInject */ (userId) => userId,
    },
  });
};
