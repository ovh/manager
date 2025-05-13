import template from './private-database-database-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.list', {
    url: '',
    template,
    controller: 'PrivateDatabaseBDDsListCtrl',
    controllerAs: 'listCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
