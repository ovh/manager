import template from './private-database-user-grants.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user.dashboard.grants', {
    url: '/grants',
    template,
    controller: 'PrivateDatabaseUsersGrantsCtrl',
    controllerAs: 'usersGrantsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_user_grants'),
    },
  });
};
