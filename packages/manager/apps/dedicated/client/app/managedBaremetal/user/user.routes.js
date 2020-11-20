export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users', {
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
          'app.managedBaremetal.details.users',
          message,
          type,
          reload,
        );
      },
      addUser: /* @ngInject */ ($state) => (passwordPolicy) =>
        $state.go('app.managedBaremetal.details.users.add', {
          passwordPolicy,
        }),
      deleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.delete', {
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.disable', {
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.edit', {
          user,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.enable', {
          user,
        }),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.managedBaremetal.details.users.user.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.managedBaremetal.details.users.user.password-reset', {
          passwordPolicy,
          user,
        }),
    },
  });

  $stateProvider.state('app.dedicatedCloud.details.users.user', {
    url: '/:userId',
    redirectTo: 'app.dedicatedCloud.details.users',
    resolve: {
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
    },
  });
};
