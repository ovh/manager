import LogConstants from '../../../logs-constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.subscriptions', {
    url: '/subscriptions',
    component: 'dbaasLogsDetailStreamsSubscriptions',
    atInternet: {
      rename: `${LogConstants.TRACKING_PREFIX}::ldp::listing::data_flow::subscriptions`,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_subscriptions'),
    },
  });
};
