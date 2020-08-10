import template from './private-database-database-dump.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.dump', {
    url: '/dump',
    template,
    controller: 'PrivateDatabaseBDDsDumpsCtrl',
  });
};
