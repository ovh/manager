export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users', {
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
        $state.go('app.managedBaremetal.details.users.delete', {
          userId: user.userId,
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.disable', {
          userId: user.userId,
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.edit', {
          userId: user.userId,
          user,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.managedBaremetal.details.users.user.enable', {
          userId: user.userId,
          user,
        }),
      goToAddFederation: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.users.federation-add'),
      goToImportUser: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.users.import'),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.managedBaremetal.details.users.user.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.managedBaremetal.details.users.password-reset', {
          passwordPolicy,
          user,
          userId: user.userId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_user'),
    },
  });

  $stateProvider.state('app.managedBaremetal.details.users.user', {
    url: '/:userId',
    redirectTo: 'app.managedBaremetal.details.users',
    resolve: {
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      breadcrumb: /* @ngInject */ (userId) => userId,
    },
  });
};
