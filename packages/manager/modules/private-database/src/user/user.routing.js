import controller from './private-database-user.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user', {
    url: '/user',
    template: '<div ui-view></div>',
    controller,
    redirectTo: 'app.private-database.dashboard.user.list',
    resolve: {
      goToUsers: /* @ngInject */ ($state) => () =>
        $state.go('app.private-database.dashboard.user.list'),
      goToGrants: /* @ngInject */ ($state) => (user) =>
        $state.go('app.private-database.dashboard.user.dashboard.grants', {
          userName: user.userName,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_user'),
    },
  });

  $stateProvider.state('app.private-database.dashboard.user.dashboard', {
    url: '/:userName',
    template: '<div ui-view></div>',
    redirectTo: 'app.private-database.dashboard.user',
    resolve: {
      userName: /* @ngInject */ ($transition$) =>
        $transition$.params().userName,
      breadcrumb: /* @ngInject */ (userName) => userName,
    },
  });
};
