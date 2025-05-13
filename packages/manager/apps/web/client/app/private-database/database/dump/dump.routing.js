import template from './private-database-database-dump.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.dashboard.dump',
    {
      url: '/dump',
      template,
      controller: 'PrivateDatabaseBDDsDumpsCtrl',
      controllerAs: 'dumpCtrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('private_database_database_dump'),
      },
    },
  );
};
