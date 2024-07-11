import template from './private-database-whitelist.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.allowed-ips', {
    url: '/allowedIps',
    template,
    controller: 'PrivateDatabaseWhitelistCtrl',
    controllerAs: 'listCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_allowed_ips'),
    },
  });
};
