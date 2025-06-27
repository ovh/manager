import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import { formatDistanceToNow } from 'date-fns';
import {
  DATABASE_MONITORING_COLOR_CHARTS,
  DATABASE_MONITORING_PERIODS,
  DATABASE_MONITORING_AGGREGATE_MODES,
} from './database-statistics.constants';

angular.module('App').controller(
  'DatabaseStatisticsCtrl',
  class DatabaseStatisticsCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      DatabaseStatistics,
      ChartFactory,
      DATEFNS_LOCALE,
    ) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DatabaseStatistics = DatabaseStatistics;
      this.ChartFactory = ChartFactory;
      this.DATEFNS_LOCALE = DATEFNS_LOCALE;
      this.DATABASE_MONITORING_PERIODS = DATABASE_MONITORING_PERIODS;
      this.DATABASE_MONITORING_AGGREGATE_MODES = DATABASE_MONITORING_AGGREGATE_MODES;
      this.databaseSelected = {
        period: null,
        name: null,
      };
      this.databaseIds =
        $scope.$parent.$parent.$parent.$parent.$parent.databaseIds;
    }

    $onInit() {
      this.loadingDatabaseGraph = true;
      [this.databaseSelected.name] = this.databaseIds;
      this.databaseSelected.period = DATABASE_MONITORING_PERIODS.find(
        ({ isDefault }) => isDefault === true,
      );
      this.aggregateMode = DATABASE_MONITORING_AGGREGATE_MODES.find(
        ({ isDefault }) => isDefault === true,
      );
      this.initDatabaseChart();
    }

    initDatabaseChart() {
      this.loadingDatabaseGraph = true;
      return this.DatabaseStatistics.getDatabaseMetricsToken(
        this.$stateParams.productId,
        this.databaseSelected.name,
      )
        .then(({ endpoint, token }) => {
          const promQueries = [
            (start, end) => {
              const query =
                this.aggregateMode.label === 'ALL'
                  ? `sum(sharedsql_queries_allowed_denied{database="${
                      this.databaseSelected.name.split('.')[0]
                    }"})`
                  : `sharedsql_queries_allowed_denied{database="${
                      this.databaseSelected.name.split('.')[0]
                    }"}`;
              const url = `${endpoint}/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${end.toISOString()}&step=${
                this.databaseSelected.period.step
              }`;
              const headers = {
                authorization: `bearer ${token}`,
                'content-type': 'application/x-www-form-urlencoded',
              };

              return fetch(url, { headers })
                .then((response) => (response.ok ? response.json() : null))
                .then((response) => response.data);
            },
          ];

          this.databaseChart = new this.ChartFactory({
            type: 'line',
            plugins: [ChartDatasourcePrometheusPlugin],
            options: {
              animation: {
                duration: 0,
              },
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                },
                tooltip: {
                  axis: 'xy',
                  mode: 'nearest',
                  intersect: false,
                  callbacks: {
                    title(data) {
                      return formatDistanceToNow(new Date(data[0].parsed.x), {
                        addSuffix: true,
                        locale: this.DATEFNS_LOCALE,
                      });
                    },
                  },
                },
                zoom: {
                  zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'xy',
                    limits: {
                      max: 10,
                      min: 0,
                    },
                  },
                },
                'datasource-prometheus': {
                  borderWidth: 1,
                  dataSetHook: (datasets) =>
                    datasets.map((ds) => {
                      ds.data.forEach((point) => {
                        if (!point.y) {
                          // eslint-disable-next-line no-param-reassign
                          point.y = 0;
                        }
                      });
                      return ds;
                    }),
                  loadingMsg: {
                    message: this.$translate.instant(
                      'hosting_tab_STATISTICS_loading',
                    ),
                  },
                  errorMsg: {
                    message: this.$translate.instant(
                      'hosting_tab_STATISTICS_none',
                    ),
                  },
                  noDataMsg: {
                    message: this.$translate.instant(
                      'hosting_tab_STATISTICS_none',
                    ),
                  },
                  fill: true,
                  findInBorderColorMap: ({ labels: { type } }) =>
                    DATABASE_MONITORING_COLOR_CHARTS[type]?.border ||
                    DATABASE_MONITORING_COLOR_CHARTS.default.border,
                  findInBackgroundColorMap: ({ labels: { type } }) =>
                    DATABASE_MONITORING_COLOR_CHARTS[type]?.bg ||
                    DATABASE_MONITORING_COLOR_CHARTS.default.bg,
                  findInLabelMap: ({ labels: { type } }) =>
                    type
                      ? this.$translate.instant(
                          `hosting_tab_STATISTICS_type_${type}`,
                        )
                      : this.$translate.instant(
                          `hosting_tab_STATISTICS_aggregate_ALL`,
                        ),
                  tension: 0.6,
                  query: promQueries,
                  timeRange: {
                    type: 'relative',
                    start: this.databaseSelected.period.timeRange,
                    end: 0,
                  },
                },
              },
              scales: {
                y: {
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: this.$translate.instant(
                      'hosting_tab_STATISTICS_series_unit_hits_min',
                    ),
                  },
                  grid: {
                    drawBorder: true,
                    display: true,
                  },
                },
                x: {
                  type: 'time',
                  position: 'bottom',
                  adapters: {
                    date: { locale: this.DATEFNS_LOCALE },
                  },
                  grid: {
                    drawBorder: true,
                    display: false,
                  },
                  time: {
                    displayFormats: {
                      hour: 'Ppp',
                    },
                  },
                },
              },
              elements: {
                point: {
                  radius: 0,
                },
              },
            },
          });
        })
        .finally(() => {
          this.loadingDatabaseGraph = false;
        });
    }
  },
);
