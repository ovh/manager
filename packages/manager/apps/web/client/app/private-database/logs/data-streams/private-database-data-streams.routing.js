import { PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS } from './private-database-data-streams.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'privateDatabaseLogsView@app.private-database.dashboard':
        'privateDatabaseDataStreams',
    },
    atInternet: {
      rename: PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        $state.go(
          'app.private-database.dashboard.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};
