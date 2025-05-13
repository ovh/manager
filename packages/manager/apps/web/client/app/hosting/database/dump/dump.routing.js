import controller from './hosting-database-dump.controller';
import template from './DUMPS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.dashboard.dump', {
    url: '/dump',
    template,
    controller,
    controllerAs: 'ctrlDumps',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database_dump'),
    },
  });
};
