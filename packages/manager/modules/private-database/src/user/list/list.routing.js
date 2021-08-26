import template from './private-database-user-list.html';
import controller from './private-database-user-list.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user.list', {
    url: '',
    template,
    controller,
    controllerAs: 'usersListCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
