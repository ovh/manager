import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import get from 'lodash/get';
import head from 'lodash/head';
import set from 'lodash/set';
import { STATUS_OVHCLOUD_URL } from '../../constants';

angular.module('App').controller(
  'PrivateDatabaseMetricsCtrl',
  class PrivateDatabaseMetricsCtrl {
    /* @ngInject */
    constructor(
      $http,
      $q,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      ChartFactory,
      DATEFNS_LOCALE,
    ) {
      this.$http = $http;
      this.$q = $q;
      this.$scope = $scope;
      this.serviceName = $stateParams.productId;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.ChartFactory = ChartFactory;
      this.DATEFNS_LOCALE = DATEFNS_LOCALE;
      this.STATUS_OVHCLOUD_URL = STATUS_OVHCLOUD_URL;
      this.isFetchingMetrics = false;
    }

    $onInit() {
      return this.fetchMetricsToken();
    }

    fetchMetricsToken() {
      this.isFetchingMetrics = true;
      this.noMemoryUseData = false;
      const bgColor = '#9BD0F5';
      const borderColor = '#36A2EB';

      return this.$http
        .get(`/hosting/privateDatabase/${this.serviceName}/metricsToken`)
        .then(({ data }) => {
          this.chartMemoryUsage = new this.ChartFactory({
            type: 'line',
            plugins: [ChartDatasourcePrometheusPlugin],
            options: {
              animation: { duration: 0 },
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                point: {
                  radius: 0,
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  display: true,
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    title: (items) => get(head(items), 'xLabel'),
                    label: (item) =>
                      `${Math.round(item.parsed.y / 1024 / 1024)}Mb`,
                  },
                },
                'datasource-prometheus': {
                  borderWidth: 1,
                  fill: true,
                  findInBackgroundColorMap: () => bgColor,
                  findInBorderColorMap: () => borderColor,
                  findInLabelMap: () =>
                    this.$translate.instant(
                      'privateDatabase_metrics_memoryUsages_graph_dbaas_metrics_exec_memsw',
                    ),
                  query: (start, end, step) => {
                    const url = `${
                      data.endpoint
                    }/prometheus/api/v1/query_range?query=containers_swap{container_name="${
                      this.serviceName
                    }"}&start=${start.toISOString()}&end=${end.toISOString()}&step=${step}`;

                    const headers = {
                      authorization: `bearer ${data.token}`,
                      'content-type': 'application/x-www-form-urlencoded',
                    };

                    return fetch(url, { headers })
                      .then((response) => {
                        if (response.ok) {
                          return response.json();
                        }

                        if (response.status === 403) {
                          return this.fetchMetricsToken();
                        }

                        return null;
                      })
                      .then((response) => response.data)
                      .catch(() => {
                        this.noMemoryUseData = true;
                      });
                  },
                  timeRange: {
                    type: 'relative',

                    // from 24 hours ago to now
                    start: -24 * 60 * 60 * 1000,
                    end: 0,
                  },
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true,
                  title: {
                    display: true,
                  },
                  grid: {
                    display: true,
                  },
                  ticks: {
                    callback: (label) => `${Math.round(label / 1024 / 1024)}Mb`,
                  },
                },
                x: {
                  type: 'timeseries',
                  position: 'bottom',
                  grid: {
                    display: false,
                  },
                  adapters: {
                    date: { locale: this.DATEFNS_LOCALE },
                  },
                  time: {
                    displayFormats: {
                      hour: 'H:mm a',
                    },
                  },
                },
              },
            },
          });

          this.chartConnections = new this.ChartFactory({
            type: 'line',
            plugins: [ChartDatasourcePrometheusPlugin],
            options: {
              animation: { duration: 0 },
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                point: {
                  radius: 0,
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  display: true,
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    title: (items) => get(head(items), 'xLabel'),
                    label: (item) => `${item.formattedValue}`,
                  },
                },
                'datasource-prometheus': {
                  borderWidth: 1,
                  fill: true,
                  findInBackgroundColorMap: () => bgColor,
                  findInBorderColorMap: () => borderColor,
                  findInLabelMap: () => {
                    return this.$translate.instant(
                      'privateDatabase_metrics_activeConnections_graph_dbaas_metrics_mysql_threads_connected',
                    );
                  },
                  query: (start, end, step) => {
                    const url = `${
                      data.endpoint
                    }/prometheus/api/v1/query_range?query=mysql_global_status_threads_connected{container_name="${
                      this.serviceName
                    }"}&start=${start.toISOString()}&end=${end.toISOString()}&step=${step}`;
                    const headers = {
                      authorization: `bearer ${data.token}`,
                      'content-type': 'application/x-www-form-urlencoded',
                    };

                    return fetch(url, { headers })
                      .then((response) => {
                        if (response.ok) {
                          return response.json();
                        }

                        if (response.status === 403) {
                          return this.fetchMetricsToken();
                        }

                        return null;
                      })
                      .then((response) => response.data)
                      .catch(() => {
                        this.noActiveConnectionsData = true;
                      });
                  },
                  timeRange: {
                    type: 'relative',

                    // from 24 hours ago to now
                    start: -24 * 60 * 60 * 1000,
                    end: 0,
                  },
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true,
                  title: {
                    display: true,
                  },
                  grid: {
                    display: true,
                  },
                  suggestedMin: 0,
                  ticks: {
                    stepSize: 1,
                  },
                },
                x: {
                  type: 'time',
                  position: 'bottom',
                  grid: {
                    display: false,
                  },
                  adapters: {
                    date: { locale: this.DATEFNS_LOCALE },
                  },
                  time: {
                    displayFormats: {
                      hour: 'H:mm a',
                    },
                  },
                },
              },
            },
          });
        })
        .catch((err) => {
          if (err.status >= 500) {
            this.migration = true;
            return this.$q.reject(false);
          }
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('privateDatabase_dashboard_loading_error'),
            err,
            this.$scope.alerts.main,
          );
          return this.$q.reject(false);
        })
        .finally(() => {
          this.isFetchingMetrics = false;
        });
    }
  },
);
