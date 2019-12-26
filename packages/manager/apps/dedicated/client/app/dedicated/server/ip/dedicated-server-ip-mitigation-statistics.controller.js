import head from 'lodash/head';

angular.module('App').controller('ServerIpMitigationStatisticsCtrl', [
  '$scope',
  'Server',
  'STATISTICS_SCALE',
  '$filter',
  '$timeout',
  '$translate',

  function ServerIpMitigationStatisticsCtrl(
    $scope,
    Server,
    statisticsScale,
    $filter,
    $timeout,
    $translate,
  ) {
    $scope.selectedIpAndBlock = $scope.currentActionData;
    $scope.statsLoading = false;

    $scope.statisticsScalesAvailable = null;

    $scope.loadStatisticsScale = function loadStatisticsScale() {
      Server.getMitigationStatisticsScale().then((data) => {
        $scope.statisticsScalesAvailable = data;
        if (data.length > 0) {
          $scope.model.scale = head(data);
        }
        $scope.model.mode = 'realTime';
      });
    };

    const createChart = function createChart() {
      let series = [];
      let plotOptionSeries = {};
      let d = new Date();
      const offset = d.getTimezoneOffset() * 60000;

      if ($scope.data) {
        d = new Date($scope.data.pointStart);
        plotOptionSeries = {
          pointInterval: $scope.data.pointInterval.millis,
          pointStart: Date.UTC(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
          ),
          marker: {
            enabled: false,
          },
        };
        series = [
          {
            data: $scope.data.valuesIn,
            showInLegend: false,
          },
          {
            data: $scope.data.valuesOut,
            showInLegend: false,
          },
        ];
      }

      $scope.chartOptions = {
        chart: {
          renderTo: 'statsChart',
          type: 'area',
          width: 475,
          height: 300,
          zoomType: 'x',
        },
        credits: {
          enabled: false,
        },
        title: {
          text: '',
          x: -20, // center
        },
        subtitle: {
          x: -20,
        },
        xAxis: {
          type: 'datetime',
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          formatter() {
            let text = $filter('date')(
              new Date(this.x + offset),
              'dd/MM - HH:mm:ss',
            );
            text += `<br/>${$translate.instant(
              'server_configuration_mitigation_statistics_input',
            )} : ${this.points[0].point.formatted.value} ${$translate.instant(
              `server_configuration_mitigation_statistics_unit_${this.points[0].point.formatted.unit}`,
            )}`;
            text += `<br/>${$translate.instant(
              'server_configuration_mitigation_statistics_output',
            )} : ${this.points[1].point.formatted.value} ${$translate.instant(
              `server_configuration_mitigation_statistics_unit_${this.points[1].point.formatted.unit}`,
            )}`;
            return text;
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#808080',
            },
          ],
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 100,
          borderWidth: 0,
        },
        plotOptions: {
          series: plotOptionSeries,
        },
        series,
      };
    };
    let timeout = null;
    const clearTO = function clearTO() {
      if (timeout) {
        $timeout.cancel(timeout);
      }
    };
    const realTimeStats = function realTimeStats() {
      clearTO();
      if (
        $scope.statisticsScalesAvailable &&
        $scope.statisticsScalesAvailable.length > 0
      ) {
        $scope.statsLoading = true;
        Server.getMitigationRealTimeStatistics(
          $scope.selectedIpAndBlock.block.ip,
          $scope.selectedIpAndBlock.ip.ip,
        ).then(
          (data) => {
            $scope.data = data;
            if ($scope.data.noData) {
              clearTO();
            }
            $scope.statsLoading = false;
          }, //
          () => {
            $scope.statsLoading = false;
          },
        );
        timeout = $timeout(() => {
          realTimeStats();
        }, 10000);
      }
    };

    $scope.$watch(
      'data',
      (newData) => {
        $timeout(
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

    $scope.model = {
      from: new Date(),
      scale: null,
      mode: null,
    };

    $scope.getStatistics = function getStatistics() {
      if ($scope.model.from && $scope.model.scale) {
        $scope.statsLoading = true;
        Server.getMitigationStatistics(
          $scope.selectedIpAndBlock.block.ip,
          $scope.selectedIpAndBlock.ip.ip,
          $scope.model.from.toISOString(),
          $scope.model.scale,
        ).then(
          (data) => {
            $scope.data = data;
            $scope.statsLoading = false;
          }, //
          () => {
            $scope.statsLoading = false;
          },
        );
      }
    };

    $scope.$watch('model.mode', (newValue, oldValue) => {
      if (newValue && (newValue !== oldValue || !$scope.data)) {
        if (newValue === 'realTime') {
          realTimeStats();
        } else {
          clearTO();
        }
      }
    });

    $scope.closeAction = function closeAction() {
      clearTO();
      $scope.resetAction();
    };

    createChart();
  },
]);
