import controller from './private-database-state.controller';
import template from './private-database-state.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.state', {
    url: '',
    template,
    controller,
    controllerAs: 'stateCtrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
