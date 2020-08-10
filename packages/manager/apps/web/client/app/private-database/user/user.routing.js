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
      goToGrants: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.user.grants'),
    },
  });
};
