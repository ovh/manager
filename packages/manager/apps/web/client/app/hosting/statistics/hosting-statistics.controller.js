import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import { formatDistanceToNow } from 'date-fns';

import { STATUS_OVHCLOUD_URL } from '../../constants';

angular
  .module('App')
  .controller(
    'HostingStatisticsCtrl',
    (
      $scope,
      $stateParams,
      $translate,
      $q,
      HostingStatistics,
      ChartFactory,
      DATEFNS_LOCALE,
    ) => {
      $scope.STATUS_OVHCLOUD_URL = STATUS_OVHCLOUD_URL;
      $scope.loadingGraph = true;

      $scope.selected = {
        period: null,
        type: null,
        aggregateMode: null,
        httpMeanResponseTime: false,
      };

      $scope.model = {
        constants: null,
        data: null,
        db: null,
        yUnit: null,
      };

      $scope.$on('$locationChangeStart', () => {
        $scope.loadingGraph = true;
      });

      $scope.initChart = () => {
        $scope.loadingGraph = true;
        return HostingStatistics.getMetricsToken($stateParams.productId).then(
          ({ endpoint, token }) => {
            const query =
              $scope.selected.type.query instanceof Function
                ? $scope.selected.type.query(
                    $stateParams.productId,
                    $scope.selected.period.step,
                    $scope.selected.period.rawStep,
                  )
                : `${$scope.selected.type.query}{service_name="${$stateParams.productId}"}`;

            const promQueries = [
              (start, end) => {
                let url = `${endpoint}/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${end.toISOString()}&step=${
                  $scope.selected.period.step
                }`;
                if (
                  $scope.selected.type.label === 'IN_HTTP_HITS' &&
                  $scope.selected.aggregateMode === 'ALL'
                ) {
                  url = `${endpoint}/prometheus/api/v1/query_range?query=sum without(cluster, statusCode, cluster_name, datacenter, host, host_type, hw_profile, service_name, user)(sum_over_time(aggregator_stats_in_httpHits_value{ service_name="${
                    $stateParams.productId
                  }" }[${$scope.selected.period.step}])) / ${
                    $scope.selected.period.rawStep
                  } OR vector(0)&start=${start.toISOString()}&end=${end.toISOString()}&step=${
                    $scope.selected.period.step
                  }`;
                }
                const headers = {
                  authorization: `bearer ${token}`,
                  'content-type': 'application/x-www-form-urlencoded',
                };

                return fetch(url, { headers })
                  .then((response) => {
                    if (response.ok) {
                      return response.json();
                    }

                    return null;
                  })
                  .then((response) => response.data);
              },
            ];

            $scope.chart = new ChartFactory({
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
                          locale: DATEFNS_LOCALE,
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
                    dataSetHook: (datasets) => {
                      return datasets.map((ds) => {
                        ds.data.forEach((point) => {
                          if (!point.y) {
                            // eslint-disable-next-line no-param-reassign
                            point.y = 0;
                          }
                        });
                        return ds;
                      });
                    },
                    loadingMsg: {
                      message: $translate.instant(
                        'hosting_tab_STATISTICS_loading',
                      ),
                    },
                    errorMsg: {
                      message: $translate.instant(
                        'hosting_tab_STATISTICS_none',
                      ),
                    },
                    noDataMsg: {
                      message: $translate.instant(
                        'hosting_tab_STATISTICS_none',
                      ),
                    },
                    fill: true,
                    fillGaps: $scope.selected.type.fillGaps === true,
                    findInBorderColorMap: ({ labels }) => {
                      if (labels.ftpC) {
                        return $scope.model.constants.colors[labels.ftpC]
                          ?.border;
                      }

                      if (labels.resourceType) {
                        return $scope.model.constants.colors[
                          labels.resourceType
                        ]?.border;
                      }
                      if (labels.status_code) {
                        return $scope.model.constants.colors[labels.status_code]
                          ?.border;
                      }

                      if (labels.statusCode) {
                        return $scope.model.constants.colors[labels.statusCode]
                          ?.border;
                      }

                      return $scope.model.constants.colors.base.border;
                    },
                    findInBackgroundColorMap: ({ labels }) => {
                      if (labels.ftpC) {
                        return $scope.model.constants.colors[labels.ftpC]?.bg;
                      }

                      if (labels.resourceType) {
                        return $scope.model.constants.colors[
                          labels.resourceType
                        ]?.bg;
                      }
                      if (labels.status_code) {
                        return $scope.model.constants.colors[labels.status_code]
                          ?.bg;
                      }

                      if (labels.statusCode) {
                        return $scope.model.constants.colors[labels.statusCode]
                          ?.bg;
                      }

                      return $scope.model.constants.colors.base.bg;
                    },
                    findInLabelMap: ({ labels }) => {
                      if (labels.usage) {
                        return labels.usage;
                      }

                      if (labels.ftpC) {
                        return labels.ftpC;
                      }

                      if (labels.overload) {
                        return labels.overload;
                      }

                      if (labels.resourceType) {
                        return labels.resourceType;
                      }

                      if (labels.status_code) {
                        return labels.status_code;
                      }

                      if (labels.statusCode) {
                        return labels.statusCode;
                      }

                      if (labels.tcp) {
                        return labels.tcp;
                      }

                      return $translate.instant(
                        'hosting_tab_STATISTICS_aggregate_ALL',
                      );
                    },
                    tension: 0.6,
                    query: promQueries,
                    timeRange: {
                      type: 'relative',
                      start: $scope.selected.period.timeRange,
                      end: 0,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: $scope.selected.type.unit,
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
                      date: { locale: DATEFNS_LOCALE },
                    },
                    grid: {
                      drawBorder: true,
                      display: false,
                    },
                    time: {
                      displayFormats: {
                        hour: 'Pp',
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
            $scope.loadingGraph = false;
          },
        );
      };

      function init() {
        return HostingStatistics.getStatisticsConstants().then((data) => {
          $scope.model.constants = data;

          $scope.selected.type = data.types.find(
            ({ isDefault }) => isDefault === true,
          );
          $scope.selected.period = data.periods.find(
            ({ isDefault }) => isDefault === true,
          );
          $scope.selected.aggregateMode = data.defaultAggregateMode;

          return $scope.initChart();
        });
      }

      init();
    },
  );
