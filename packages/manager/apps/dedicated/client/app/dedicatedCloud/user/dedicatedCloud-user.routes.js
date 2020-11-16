export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.users', {
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
          'app.dedicatedClouds.users',
          message,
          type,
          reload,
        );
      },
      addUser: /* @ngInject */ ($state) => (passwordPolicy) =>
        $state.go('app.dedicatedClouds.users.add', {
          passwordPolicy,
        }),
      deleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedClouds.users.delete', {
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedClouds.users.disable', {
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedClouds.users.edit', {
          user,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedClouds.users.enable', {
          user,
        }),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.dedicatedClouds.users.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.dedicatedClouds.users.password-reset', {
          passwordPolicy,
          user,
        }),
    },
  });
};
