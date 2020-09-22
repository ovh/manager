import template from './private-database-user.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user', {
    url: '/user',
    template,
    controller: 'PrivateDatabaseUsersCtrl',
    redirectTo: 'app.private-database.dashboard.user.list',
    resolve: {
      goToUsers: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.user.list'),
      goToGrants: /* @ngInject */ ($state) => (user) =>
        $state.go('app.private-database.dashboard.user.dashboard.grants', {
          userName: user.userName,
        }),
    },
  });

  $stateProvider.state('app.private-database.dashboard.user.dashboard', {
    url: '/:userName',
    template: '<div ui-view></div>',
    redirectTo: 'app.private-database.dashboard.user',
    resolve: {
      userName: /* @ngInject */ ($transition$) =>
        $transition$.params().userName,
    },
  });
};
