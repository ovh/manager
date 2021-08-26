import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import map from 'lodash/map';
import merge from 'lodash/merge';
import set from 'lodash/set';

export default class PrivateDatabaseMetricsCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, WucChartjsFactory, PrivateDatabase) {
    this.$scope = $scope;
    this.$translate = $translate;

    this.Alerter = Alerter;
    this.WucChartjsFactory = WucChartjsFactory;
    this.PrivateDatabase = PrivateDatabase;

    this.PRIVATE_DATABASE_METRICS = {
      settingsForAllCharts: {
        type: 'line',
        data: {
          datasets: [],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            display: true,
          },
          elements: {
            point: {
              radius: 0,
            },
          },
        },
      },
      settingsForAllSeries: {
        dataset: {
          fill: true,
          borderWidth: 1,
        },
      },
      specificDatabaseVersionChartSelection: {},
      specificChartSettings: [
        {
          chartName: 'memoryUsages',
          dataFromAPIIndex: 0,
          options: {
            tooltips: {
              mode: 'label',
              intersect: false,
              callbacks: {
                title: (items) => get(head(items), 'xLabel'),
                label: (item) => `${Math.round(item.yLabel / 1024 / 1024)}Mb`,
              },
            },
            scales: {
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  scaleLabel: {
                    display: true,
                  },
                  gridLines: {
                    drawBorder: true,
                    display: true,
                  },
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    callback: (label) => `${Math.round(label / 1024 / 1024)}Mb`,
                  },
                },
              ],
              xAxes: [
                {
                  type: 'time',
                  position: 'bottom',
                  gridLines: {
                    drawBorder: true,
                    display: false,
                  },
                  time: {
                    displayFormats: {
                      hour: 'LT',
                    },
                  },
                },
              ],
            },
          },
        },
        {
          chartName: 'activeConnections',
          dataFromAPIIndex: 1,
          options: {
            tooltips: {
              mode: 'label',
              intersect: false,
              callbacks: {
                title: (items) => get(head(items), 'xLabel'),
                label: (item) => `${item.yLabel}`,
              },
            },
            scales: {
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  scaleLabel: {
                    display: true,
                  },
                  gridLines: {
                    drawBorder: true,
                    display: true,
                  },
                  ticks: {
                    suggestedMin: 0,
                    stepSize: 1,
                  },
                },
              ],
              xAxes: [
                {
                  type: 'time',
                  position: 'bottom',
                  gridLines: {
                    drawBorder: true,
                    display: false,
                  },
                  time: {
                    displayFormats: {
                      hour: 'LT',
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    };
  }

  $onInit() {
    this.charts = {};

    return this.fetchingMetrics();
  }

  fetchingMetrics() {
    this.isFetchingMetrics = true;

    return this.PrivateDatabase.getGraphData({
      graphEndpoint: this.$scope.database.graphEndpoint,
      range: 'DAY',
    })
      .then((chartData) => {
        if (!isArray(chartData)) {
          throw new Error(this.$translate.instant('common_temporary_error'));
        }

        const chartSettings = this.PRIVATE_DATABASE_METRICS
          .specificDatabaseVersionChartSelection[this.$scope.database.version];

        forEach(
          filter(
            this.PRIVATE_DATABASE_METRICS.specificChartSettings,
            (currentChartSettings) =>
              !isArray(chartSettings) ||
              includes(chartSettings, currentChartSettings.chartName),
          ),
          (currentChartSettings) => {
            const { chartName } = currentChartSettings;
            const currentChartData =
              chartData[currentChartSettings.dataFromAPIIndex];

            if (!isObject(currentChartData)) {
              this.charts[chartName] = {
                hasData: false,
                name: chartName,
              };
            } else {
              const settingsForAllCharts = cloneDeep(
                this.PRIVATE_DATABASE_METRICS.settingsForAllCharts,
              );
              const settingsForCurrentChart = merge(
                settingsForAllCharts,
                currentChartSettings,
              );
              const chart = new this.WucChartjsFactory(settingsForCurrentChart);
              const serieName = this.$translate.instant(
                `privateDatabase_metrics_${chartName}_graph_${currentChartData.metric.replace(
                  /\./g,
                  '_',
                )}`,
              );
              const serieValue = this.constructor.getChartSeries(
                currentChartData,
              );

              chart.addSerie(
                serieName,
                serieValue,
                this.PRIVATE_DATABASE_METRICS.settingsForAllSeries,
              );

              this.charts[chartName] = {
                hasData: true,
                data: chart,
                name: chartName,
              };
            }
          },
        );
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_dashboard_loading_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.isFetchingMetrics = false;
      });
  }

  static getChartSeries(data) {
    return map(keys(data.dps), (key) => ({
      x: key * 1000,
      y: Math.round(data.dps[key] * 100) / 100,
    }));
  }
}
