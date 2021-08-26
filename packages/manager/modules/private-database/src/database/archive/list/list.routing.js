import template from './private-database-database-archive-list.html';
import controller from './private-database-database-archive-list.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive.list', {
    url: '',
    template,
    controller,
    controllerAs: 'archiveListCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
