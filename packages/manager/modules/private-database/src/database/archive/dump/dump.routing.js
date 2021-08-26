import template from './private-database-database-archive-dump.html';
import controller from './private-database-database-archive-dump.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.archive.dashboard.dump',
    {
      url: '/dump',
      template,
      controller,
      controllerAs: 'archiveDumpCtrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('private_database_database_archive_dump'),
      },
    },
  );
};
