import template from './private-database-database-extension.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.extension', {
    url: '/extension',
    template,
    controller: 'PrivateDatabaseBDDsExtensionCtrl',
  });
};
