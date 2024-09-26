angular.module('services').service(
  'HostingStatistics',
  class HostingStatistics {
    /* @ngInject */
    constructor($http, $q, OvhHttp) {
      this.$http = $http;
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    getLogs(serviceName, attachedDomain) {
      const fqdn = attachedDomain || serviceName;

      return this.$http
        .get(`/hosting/web/${serviceName}/ownLogs`, {
          params: {
            fqdn,
          },
        })
        .then(({ data }) =>
          data.length > 0
            ? this.$http.get(`/hosting/web/${serviceName}/ownLogs/${data[0]}`)
            : { data: {} },
        )
        .then(({ data: ownLog }) => ownLog);
    }

    getMetricsToken(serviceName) {
      return this.$http
        .get(`/hosting/web/${serviceName}/metricsToken`)
        .then((data) => data.data);
    }

    getStatisticsConstants() {
      return this.$q.when({
        types: [
          {
            label: 'IN_FTP_COMMANDS',
            query: 'aggregator_stats_in_ftpComm_value',
          },
          {
            label: 'IN_HTTP_HITS',
            query: 'aggregator_stats_in_httpHits_value',
            isDefault: true,
            unit: 'hits',
          },
          {
            label: 'IN_HTTP_MEAN_RESPONSE_TIME',
            query: 'aggregator_stats_in_httpMeanResponseTime_value',
            unit: 'ms',
          },
          {
            label: 'OUT_TCP_CONN',
            query: 'aggregator_stats_out_tcpConn_value',
          },
          {
            label: 'SYS_CPU_USAGE',
            query: 'aggregator_stats_cgroupCpuUsage_value',
          },
          {
            label: 'SYS_WORKER_SPAWN_OVERLOAD',
            query: 'aggregator_stats_workerSpawnOverload_value',
          },
        ],
        dbTypes: [{ label: 'STATEMENT' }, { label: 'STATEMENT_MEAN_TIME' }],
        periods: [
          { label: 'DAILY', value: '1d', timeRange: -24 * 60 * 60 * 1000 },
          {
            label: 'WEEKLY',
            value: '7d',
            timeRange: -7 * 24 * 60 * 60 * 1000,
            isDefault: true,
          },
          {
            label: 'MONTHLY',
            value: '30d',
            timeRange: -1 * 30 * 24 * 60 * 60 * 1000,
          },
          {
            label: 'YEARLY',
            value: '365d',
            timeRange: -365 * 24 * 60 * 60 * 1000,
          },
        ],
        aggregateModes: ['ALL', 'HTTP_CODE'],
        defaultAggregateMode: 'HTTP_CODE',
        colors: {
          200: {
            bg: '#EAECF4',
            border: '#848CBC',
          },
          300: {
            bg: '#FFF3E6',
            border: '#FDB259',
          },
          400: {
            bg: '#EAF7FF',
            border: '#B6E1FF',
          },
          500: {
            bg: '#EF4339',
            border: '#D1190F',
          },
          base: {
            bg: '#EAF7FF',
            border: '#A2D9FF',
          },
          dynamic: {
            bg: '#F8E9EF',
            border: '#B92463',
          },
          static: {
            bg: '#E9F8F4',
            border: '#24B994',
          },
        },
      });
    }
  },
);
