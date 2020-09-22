import template from './private-database-database-user.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.dashboard.user',
    {
    url: '/user',
    template,
    controller: 'PrivateDatabaseUserDatabaseCtrl',
    },
  );
};
