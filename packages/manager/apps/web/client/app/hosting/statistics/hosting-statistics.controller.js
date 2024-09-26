import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import remove from 'lodash/remove';
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
      HostingDatabase,
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

      $scope.initChart = () => {
        $scope.loadingGraph = true;
        return HostingStatistics.getMetricsToken($stateParams.productId).then(
          ({ endpoint, token }) => {
            const query = `${$scope.selected.type.query}{service_name="${$stateParams.productId}"}`;
            const queryMeanResponseTime = `aggregator_stats_in_httpMeanResponseTime_value{service_name="${$stateParams.productId}"}`;

            const promQueries = [
              (start, end) => {
                let url = `${endpoint}/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${end.toISOString()}&step=1m`;
                if (
                  $scope.selected.type.label === 'IN_HTTP_HITS' &&
                  $scope.selected.aggregateMode === 'ALL'
                ) {
                  url = `${endpoint}/prometheus/api/v1/query_range?query=sum by(service_name)(aggregator_stats_in_httpHits_value{service_name="${
                    $stateParams.productId
                  }"})&start=${start.toISOString()}&end=${end.toISOString()}&step=1m`;
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

            if ($scope.selected.httpMeanResponseTime) {
              promQueries.push((start, end) => {
                const url = `${endpoint}/prometheus/api/v1/query_range?query=${queryMeanResponseTime}&start=${start.toISOString()}&end=${end.toISOString()}&step=1m`;

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
              });
            }

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
                    mode: 'index',
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
                        min: 0.5,
                      },
                    },
                  },
                  'datasource-prometheus': {
                    borderWidth: 1,
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
                    findInBorderColorMap: ({ labels }) => {
                      if (labels.resourceType) {
                        return $scope.model.constants.colors[
                          labels.resourceType
                        ]?.border;
                      }
                      if (labels.statusCode) {
                        return $scope.model.constants.colors[labels.statusCode]
                          ?.border;
                      }

                      return $scope.model.constants.colors.base.border;
                    },
                    findInBackgroundColorMap: ({ labels }) => {
                      if (labels.resourceType) {
                        return $scope.model.constants.colors[
                          labels.resourceType
                        ]?.bg;
                      }
                      if (labels.statusCode) {
                        return $scope.model.constants.colors[labels.statusCode]
                          ?.bg;
                      }

                      return $scope.model.constants.colors.base.bg;
                    },
                    findInLabelMap: ({ labels }) => {
                      if (labels.resourceType) {
                        return labels.resourceType;
                      }

                      if (labels.statusCode) {
                        return labels.statusCode;
                      }

                      return $translate.instant(
                        'hosting_tab_STATISTICS_aggregate_ALL',
                      );
                    },
                    tension: 0.5,
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
                        hour: 'H:mm a',
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

          remove(
            $scope.model.constants.types,
            (value) => value.label === 'IN_HTTP_MEAN_RESPONSE_TIME',
          );
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
