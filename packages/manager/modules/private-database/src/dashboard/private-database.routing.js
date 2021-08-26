import controller from './private-database.controller';
import template from './private-database.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard', {
    url: '/:productId',
    template,
    controller,
    controllerAs: 'ctrl',
    reloadOnSearch: false,
    redirectTo: 'app.private-database.dashboard.state',
    resolve: {
      /* @ngInject */
      navigationInformations: (Navigator, $rootScope) => {
        // eslint-disable-next-line no-param-reassign
        $rootScope.currentSectionInformation = 'private_database';
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      hasConfiguration: /* @ngInject */ (PrivateDatabase, serviceName) =>
        PrivateDatabase.getConfigurationDetails(serviceName).then(
          (res) => res.details.length > 0,
        ),
      stateLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.state',
          $transition$.params(),
        ),
      userLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.user',
          $transition$.params(),
        ),
      databaseLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.database',
          $transition$.params(),
        ),
      allowedIPsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.allowed-ips',
          $transition$.params(),
        ),
      metricsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.metrics',
          $transition$.params(),
        ),
      logsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.logs',
          $transition$.params(),
        ),
      configurationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.configuration',
          $transition$.params(),
        ),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.private-database.dashboard.task',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });

  $stateProvider.state('app.sql-order', {
    redirectTo: 'app.private-database-order-clouddb',
    url: '/configuration/sql_order',
  });
};
