import template from './private-database-whitelist.html';
import controller from './private-database-whitelist.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.allowed-ips', {
    url: '/allowedIps',
    template,
    controller,
    controllerAs: 'listCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_allowed_ips'),
    },
  });
};
