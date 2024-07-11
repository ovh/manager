import template from './private-database-user-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user.list', {
    url: '',
    template,
    controller: 'PrivateDatabaseUsersListCtrl',
    controllerAs: 'usersListCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
