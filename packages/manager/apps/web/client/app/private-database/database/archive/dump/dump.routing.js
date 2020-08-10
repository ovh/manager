import template from './private-database-database-archive-dump.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive.dump', {
    url: '/dump',
    template,
    controller: 'PrivateDatabaseArchiveDumpCtrl',
  });
};
