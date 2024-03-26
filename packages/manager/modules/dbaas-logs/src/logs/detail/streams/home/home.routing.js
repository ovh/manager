import LogConstants from '../../../logs-constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.home', {
    url: '/home',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsHome',
    },
    atInternet: {
      rename: `${LogConstants.TRACKING_PREFIX}::ldp::listing::data_flow`,
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
