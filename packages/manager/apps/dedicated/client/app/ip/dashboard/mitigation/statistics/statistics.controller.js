import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor($locale, $scope, $timeout, $translate, IpDashboardMitigation) {
    this.$locale = $locale;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IpDashboardMitigation = IpDashboardMitigation;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.statsLoading = false;
    this.$scope.today = new Date();

    this.$scope.statisticsScalesAvailable = null;

    this.$scope.loadStatisticsScale = () => {
      this.IpDashboardMitigation.getMitigationStatisticsScale().then((data) => {
        this.$scope.statisticsScalesAvailable = data;

        if (data.length > 0) {
          this.$scope.model.scale = head(data);
        }

        this.$scope.model.mode = 'realTime';
      });
    };

    const createChart = () => {
      const dataSets = [
        get(this.$scope.stats, 'valuesIn'),
        get(this.$scope.stats, 'valuesOut'),
      ];

      this.$scope.chartData = [];
      this.$scope.chartSeries = [];

      this.$scope.chartLabels = map(
        get(this.$scope.stats, 'valuesIn'),
        (value, index) =>
          moment(this.$scope.stats.pointStart)
            .add(this.$scope.stats.pointInterval.standardDays * index, 'days')
            .add(this.$scope.stats.pointInterval.standardHours * index, 'hours')
            .add(
              this.$scope.stats.pointInterval.standardMinutes * index,
              'minutes',
            )
            .format('Y/MM/DD HH:mm:ss'),
      );

      this.$scope.chartSeries.push(
        this.$translate.instant('ip_mitigation_statistics_input'),
      );
      this.$scope.chartSeries.push(
        this.$translate.instant('ip_mitigation_statistics_output'),
      );

      this.$scope.chartData.push(
        map(get(this.$scope.stats, 'valuesIn'), (value) => value.y),
      );
      this.$scope.chartData.push(
        map(get(this.$scope.stats, 'valuesOut'), (value) => value.y),
      );

      this.$scope.chartOptions = {
        tooltips: {
          callbacks: {
            label: (tooltipItems, data) =>
              `${data.datasets[tooltipItems.datasetIndex].label}: ${
                tooltipItems.yLabel
              } ${this.$translate.instant(
                'ip_mitigation_statistics_unit_B',
              )} (${
                dataSets[tooltipItems.datasetIndex][tooltipItems.index]
                  .formatted.value
              } ${
                dataSets[tooltipItems.datasetIndex][tooltipItems.index]
                  .formatted.unit
              })`,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
              },
            },
          ],
        },
      };
    };
    let timeout = null;
    const clearTO = () => {
      if (timeout) {
        this.$timeout.cancel(timeout);
      }
    };
    const realTimeStats = () => {
      clearTO();
      if (
        this.$scope.statisticsScalesAvailable &&
        this.$scope.statisticsScalesAvailable.length > 0
      ) {
        this.$scope.statsLoading = true;
        this.IpDashboardMitigation.getMitigationRealTimeStatistics(
          this.ipBlock.ipBlock,
          this.ip.ip,
        )
          .then((data) => {
            this.$scope.stats = data;
            if (this.$scope.stats.noData) {
              clearTO();
            }
          })
          .finally(() => {
            this.$scope.statsLoading = false;
          });
        timeout = this.$timeout(() => {
          realTimeStats();
        }, 10000);
      }
    };

    this.$scope.$watch(
      'stats',
      (newData) => {
        this.$timeout(
          () => {
            if (newData) {
              createChart();
            }
          },
          5,
          true,
        );
      },
      true,
    );

    this.$scope.model = {
      from: new Date(),
      scale: null,
      mode: null,
    };

    this.$scope.datePicker = {
      dateFormat: get(this.$locale, 'DATETIME_FORMATS.shortDate'),
      isOpen: false,
      maxDate: new Date(),
    };

    this.$scope.getStatistics = () => {
      if (this.$scope.model.from && this.$scope.model.scale) {
        this.$scope.statsLoading = true;
        this.IpDashboardMitigation.getMitigationStatistics(
          this.ipBlock.ipBlock,
          this.ip.ip,
          this.$scope.model.from.toISOString(),
          this.$scope.model.scale,
        )
          .then((data) => {
            this.$scope.stats = data;
          })
          .finally(() => {
            this.$scope.statsLoading = false;
          });
      }
    };

    this.$scope.$watch('model.mode', (newValue, oldValue) => {
      if (newValue && (newValue !== oldValue || !this.$scope.stats)) {
        if (newValue === 'realTime') {
          realTimeStats();
        } else {
          clearTO();
        }
      }
    });

    this.$scope.closeAction = () => {
      clearTO();

      return this.goBack();
    };

    createChart();
  }
}
