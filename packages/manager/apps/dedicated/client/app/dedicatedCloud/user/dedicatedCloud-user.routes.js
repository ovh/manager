export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users', {
    url: '/users',
    reloadOnSearch: false,
    views: {
      pccView: 'dedicatedCloudUser',
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
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.disable', {
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.edit', {
          user,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.enable', {
          user,
        }),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.dedicatedCloud.details.users.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.dedicatedCloud.details.users.password-reset', {
          passwordPolicy,
          user,
        }),
    },
  });
};
