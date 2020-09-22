import template from './DATABASE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database', {
    url: '/database',
    template,
    controller: 'HostingTabDatabasesCtrl',
  });

  $stateProvider.state('app.hosting.dashboard.database.dashboard', {
    url: '/:name',
    template: '<div ui-view></div>',
    redirectTo: 'app.hosting.dashboard.database',
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
    },
  });
};
