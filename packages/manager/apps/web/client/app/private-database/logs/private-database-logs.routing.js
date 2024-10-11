import { PRIVATE_DATABASE_LOGS_TRACKING_HITS } from './private-database-logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.logs', {
    url: '/logs',
    views: {
      privateDatabaseLogsView: 'privateDatabaseLogs',
    },
    atInternet: {
      rename: PRIVATE_DATABASE_LOGS_TRACKING_HITS.LOGS_PAGE,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_logs'),
      logKindsList: /* @ngInject */ (logsService, serviceName) =>
        logsService.getLogKinds(serviceName),
      kind: /* @ngInject */ (logKindsList, $state) =>
        $state.params.kind || logKindsList[0].name,
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('app.private-database.dashboard.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
