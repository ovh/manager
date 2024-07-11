import template from './private-database-configuration.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.configuration', {
    url: '/configuration',
    template,
    controller: 'PrivateDatabaseConfigurationsCtrl',
    controllerAs: 'configurationsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_configuration'),
    },
  });
};
