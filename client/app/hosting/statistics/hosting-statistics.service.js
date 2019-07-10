angular.module('services').service(
  'HostingStatistics',
  class HostingStatistics {
    /**
     * Constructor
     * @param $q
     * @param OvhHttp
     */
    constructor($q, OvhHttp) {
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    getStatisticsConstants() {
      return this.$q.when({
        types: [
          'IN_FTP_COMMANDS',
          'IN_HTTP_HITS',
          'IN_HTTP_MEAN_RESPONSE_TIME',
          'OUT_TCP_CONN',
          'SYS_CPU_USAGE',
          'SYS_WORKER_SPAWN_OVERLOAD',
        ],
        dbTypes: ['STATEMENT', 'STATEMENT_MEAN_TIME'],
        defaultType: 'IN_HTTP_HITS',
        periods: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        defaultPeriod: 'WEEKLY',
        aggregateModes: ['ALL', 'HTTP_CODE', 'NONE'],
        defaultAggregateMode: 'HTTP_CODE',
      });
    }

    getStatistics(serviceName, period, type, aggregation) {
      return this.OvhHttp.get(`/sws/hosting/web/${serviceName}/statistics`, {
        rootPath: '2api',
        params: {
          period,
          type,
          aggregation,
        },
      });
    }
  },
);
