import template from './private-database-database-list.html';
import controller from './private-database-database-list.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.list', {
    url: '',
    template,
    controller,
    controllerAs: 'listCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
