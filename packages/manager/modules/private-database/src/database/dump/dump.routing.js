import template from './private-database-database-dump.html';
import controller from './private-database-database-dump.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.dashboard.dump',
    {
      url: '/dump',
      template,
      controller,
      controllerAs: 'dumpCtrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('private_database_database_dump'),
      },
    },
  );
};
