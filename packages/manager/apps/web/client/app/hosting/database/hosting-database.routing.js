import template from './DATABASE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database', {
    url: '/database',
    template,
    controller: 'HostingTabDatabasesCtrl',
  });
};
