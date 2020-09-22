import template from './DATABASE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database', {
    url: '/database',
    template,
    controller: 'HostingTabDatabasesCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database'),
    },
  });

  $stateProvider.state('app.hosting.dashboard.database.dashboard', {
    url: '/:name',
    template: '<div ui-view></div>',
    redirectTo: 'app.hosting.dashboard.database',
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      breadcrumb: /* @ngInject */ (name) => name,
    },
  });
};
