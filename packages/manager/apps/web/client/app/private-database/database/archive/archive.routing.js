export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive', {
    url: '/archive',
    redirectTo: 'app.private-database.dashboard.database.archive.list',
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_database_archive_list'),
    },
  });

  $stateProvider.state(
    'app.private-database.dashboard.database.archive.dashboard',
    {
      url: '/:databaseName',
      redirectTo: 'app.private-database.dashboard.database.archive',
      template: '<div ui-view></div>',
      resolve: {
        databaseName: /* @ngInject */ ($transition$) =>
          $transition$.params().databaseName,
        breadcrumb: /* @ngInject */ (databaseName) => databaseName,
      },
    },
  );
};
