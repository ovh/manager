import template from './private-database-database-archive-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive.list', {
    url: '',
    template,
    controller: 'PrivateDatabaseArchiveListCtrl',
    controllerAs: 'archiveListCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
