angular.module('services').service(
  'HostingStatistics',
  class HostingStatistics {
    /* @ngInject */
    constructor($http, $q, $translate, OvhHttp) {
      this.$http = $http;
      this.$q = $q;
      this.$translate = $translate;
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
            query: (serviceName, step) =>
              `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (sum_over_time(aggregator_stats_in_ftpComm_value{service_name="${serviceName}"}[${step}]))  OR  label_replace(vector(0), "ftpC", "del", "", "")  OR label_replace(vector(0), "ftpC", "upl", "", "")  OR label_replace(vector(0), "ftpC", "lOK", "", "") OR  label_replace(vector(0), "ftpC", "dwl", "", "") OR  label_replace(vector(0), "ftpC", "lKO", "", "")`,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_command',
            ),
          },
          {
            label: 'IN_HTTP_HITS',
            query: (serviceName, step, rawStep) =>
              `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time(aggregator_stats_in_httpHits_value{service_name="${serviceName}"}[${step}]),` +
              // eslint-disable-next-line no-template-curly-in-string
              '"status_code","${1}xx","statusCode","([0-9])..")) / ' +
              `${rawStep}` +
              ` OR label_replace(vector(0), "status_code", "2xx", "", "") OR  label_replace(vector(0), "status_code", "3xx", "", "")  OR label_replace(vector(0), "status_code", "4xx", "", "")  OR label_replace(vector(0), "status_code", "5xx", "", "")`,
            isDefault: true,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_hits_min',
            ),
          },
          {
            label: 'IN_HTTP_MEAN_RESPONSE_TIME',
            query: (serviceName, step) =>
              `avg_over_time(aggregator_stats_in_httpMeanResponseTime_value{service_name="${serviceName}"}[${step}])`,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_ms',
            ),
            fillGaps: true,
          },
          {
            label: 'OUT_TCP_CONN',
            query: (serviceName, step) =>
              `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (sum_over_time(aggregator_stats_out_tcpConn_value{service_name="${serviceName}"}[${step}])) OR label_replace(vector(0), "tcp", "forward", "", "")`,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_cnx_min',
            ),
          },
          {
            label: 'SYS_CPU_USAGE',
            query: (serviceName, step) =>
              `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time((aggregator_stats_cgroupCpuUsage_value{service_name="${serviceName}"}[${step}])), "usage", "cpu", "", "")) OR label_replace(vector(0), "usage", "cpu", "", "")`,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_sec_min',
            ),
          },
          {
            label: 'SYS_WORKER_SPAWN_OVERLOAD',
            query: (serviceName, step) =>
              `sum without(cluster, statusCode,cluster_name, datacenter, host, host_type, hw_profile, service_name, user) (label_replace(sum_over_time((aggregator_stats_spawnOvercharge_value{service_name="${serviceName}"}[${step}])), "overload", "php", "", "")) OR label_replace(vector(0), "overload", "php", "", "")`,
            unit: this.$translate.instant(
              'hosting_tab_STATISTICS_series_unit_overload',
            ),
          },
        ],
        dbTypes: [{ label: 'STATEMENT' }, { label: 'STATEMENT_MEAN_TIME' }],
        periods: [
          {
            label: 'DAILY',
            value: '1d',
            step: '15m',
            rawStep: 15,
            timeRange: -24 * 60 * 60 * 1000,
          },
          {
            label: 'WEEKLY',
            value: '7d',
            step: '15m',
            rawStep: 15,
            timeRange: -7 * 24 * 60 * 60 * 1000,
            isDefault: true,
          },
          {
            label: 'MONTHLY',
            value: '30d',
            step: '15m',
            rawStep: 15,
            timeRange: -1 * 30 * 24 * 60 * 60 * 1000,
          },
          {
            label: 'YEARLY',
            value: '365d',
            step: '60m',
            rawStep: 60,
            timeRange: -365 * 24 * 60 * 60 * 1000,
          },
        ],
        aggregateModes: ['ALL', 'HTTP_CODE'],
        defaultAggregateMode: 'HTTP_CODE',
        colors: {
          '2xx': {
            bg: 'rgba(234,247,255, .4)',
            border: '#00748E',
          },
          '3xx': {
            bg: 'rgba(0,106,130, .4)',
            border: '#006A82',
          },
          '4xx': {
            bg: 'rgba(244,186,77, .4)',
            border: '#F4BA4D',
          },
          '5xx': {
            bg: 'rgba(218,59,58, .4)',
            border: '#DA3B3A',
          },
          IOK: {
            bg: 'rgba(234,247,255, .4)',
            border: '#00748E',
          },
          upl: {
            bg: 'rgba(0,106,130, .4)',
            border: '#006A82',
          },
          dwl: {
            bg: 'rgba(244,186,77, .4)',
            border: '#F4BA4D',
          },
          IKO: {
            bg: 'rgba(218,59,58, .4)',
            border: '#DA3B3A',
          },
          base: {
            bg: 'rgba(234,247,255, .4)',
            border: '#A2D9FF',
          },
          dynamic: {
            bg: 'rgba(248,233,239, .4)',
            border: '#B92463',
          },
          static: {
            bg: 'rgba(233,248,244, .4)',
            border: '#24B994',
          },
        },
      });
    }
  },
);
