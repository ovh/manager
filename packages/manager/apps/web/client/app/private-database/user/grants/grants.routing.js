import template from './private-database-user-grants.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user.grants', {
    url: '/grants',
    template,
    controller: 'PrivateDatabaseUsersGrantsCtrl',
  });
};
