import controller from './private-database-database-extension.controller';
import template from './private-database-database-extension.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.private-database.dashboard.database.dashboard.extension',
    {
      url: '/extension',
      template,
      controller,
      controllerAs: 'extensionCtrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('private_database_database_extension'),
      },
    },
  );
};
