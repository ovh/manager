import _ from 'lodash';

export default class PrivateDatabaseMetricsCtrl {
  /* @ngInject */

  constructor(
    $scope, $translate,
    Alerter, WucChartjsFactory, PrivateDatabase,
  ) {
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
      specificDatabaseVersionChartSelection: {
        mysql_55: ['memoryUsages'],
      },
      specificChartSettings: [
        {
          chartName: 'memoryUsages',
          dataFromAPIIndex: 0,
          options: {
            tooltips: {
              mode: 'label',
              intersect: false,
              callbacks: {
                title: items => _(items).chain()
                  .first()
                  .get('xLabel')
                  .value(),
                label: item => `${item.yLabel}%`,
              },
            },
            scales: {
              yAxes: [{
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
                  callback: label => `${label}%`,
                },
              }],
              xAxes: [{
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
              }],
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
                title: items => _(items).chain()
                  .first()
                  .get('xLabel')
                  .value(),
                label: item => `${item.yLabel}`,
              },
            },
            scales: {
              yAxes: [{
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
              }],
              xAxes: [{
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
              }],
            },
          },
        },
        {
          chartName: 'queryExecutionTimes',
          dataFromAPIIndex: 2,
          options: {
            tooltips: {
              mode: 'label',
              intersect: false,
              callbacks: {
                title: items => _(items).chain()
                  .first()
                  .get('xLabel')
                  .value(),
                label: item => `${item.yLabel}ms`,
              },
            },
            scales: {
              yAxes: [{
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
                  callback: label => `${label}ms`,
                },
              }],
              xAxes: [{
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
              }],
            },
          },
        },
      ],
    };
  }

  $onInit() {
    this.charts = { };

    return this.fetchingMetrics();
  }

  fetchingMetrics() {
    this.isFetchingMetrics = true;

    return this.PrivateDatabase
      .getGraphData({
        graphEndpoint: this.$scope.database.graphEndpoint,
        range: 'DAY',
      })
      .then((chartData) => {
        if (!_(chartData).isArray()) {
          throw new Error(this.$translate.instant('common_temporary_error'));
        }

        const chartSettings = this.PRIVATE_DATABASE_METRICS.specificDatabaseVersionChartSelection[
          this.$scope.database.version
        ];
        _(this.PRIVATE_DATABASE_METRICS.specificChartSettings)
          .filter(currentChartSettings => !_(chartSettings).isArray()
                          || _(chartSettings).includes(currentChartSettings.chartName))
          .forEach((currentChartSettings) => {
            const { chartName } = currentChartSettings;
            const currentChartData = chartData[currentChartSettings.dataFromAPIIndex];

            if (!_(currentChartData).isObject()) {
              this.charts[chartName] = {
                hasData: false,
                name: chartName,
              };
            } else {
              const settingsForAllCharts = _(this.PRIVATE_DATABASE_METRICS.settingsForAllCharts)
                .clone(true);
              const settingsForCurrentChart = _(settingsForAllCharts)
                .merge(currentChartSettings)
                .value();
              const chart = new this.WucChartjsFactory(settingsForCurrentChart);
              const serieName = this.$translate.instant(`privateDatabase_metrics_${chartName}_graph_${currentChartData.metric.replace(/\./g, '_')}`);
              const serieValue = this.constructor.getChartSeries(currentChartData);

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
          }).value();
      })
      .catch((err) => {
        _.set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(this.$translate.instant('privateDatabase_dashboard_loading_error'), err, this.$scope.alerts.main);
      })
      .finally(() => {
        this.isFetchingMetrics = false;
      });
  }

  static getChartSeries(data) {
    return _(data.dps).keys().map(key => ({
      x: key * 1000,
      y: Math.round(data.dps[key] * 100) / 100,
    })).value();
  }
}
