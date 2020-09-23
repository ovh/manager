export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive', {
    url: '/archive',
    redirectTo: 'app.private-database.dashboard.database.archive.list',
    template: '<div ui-view></div>',
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
      },
    },
  );
};
