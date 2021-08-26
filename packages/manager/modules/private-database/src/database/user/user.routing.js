import template from './private-database-database-user.html';
import controller from './private-database-database-user.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.dashboard.user',
    {
      url: '/user',
      template,
      controller,
      controllerAs: 'privateDatabaseUserDatabaseCtrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('private_database_database_user'),
      },
    },
  );
};
