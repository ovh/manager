import controller from './private-database-configuration.controller';
import template from './private-database-configuration.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.configuration', {
    url: '/configuration',
    template,
    controller,
    controllerAs: 'configurationsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_configuration'),
    },
  });
};
