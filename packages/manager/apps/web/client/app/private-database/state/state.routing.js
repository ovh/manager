import template from './private-database-state.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.state', {
    url: '',
    template,
    controller: 'PrivateDatabaseStateCtrl',
  });
};
