import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';

export default /* @ngInject */ (
  $scope,
  $locale,
  Ip,
  IpMitigation,
  $filter,
  $timeout,
  $translate,
) => {
  $scope.data = $scope.currentActionData;
  $scope.statsLoading = false;
  $scope.today = new Date();

  $scope.statisticsScalesAvailable = null;

  $scope.loadStatisticsScale = function loadStatisticsScale() {
    IpMitigation.getMitigationStatisticsScale().then((data) => {
      $scope.statisticsScalesAvailable = data;
      if (data.length > 0) {
        $scope.model.scale = head(data);
      }
      $scope.model.mode = 'realTime';
    });
  };

  const createChart = function createChart() {
    const dataSets = [
      get($scope.stats, 'valuesIn'),
      get($scope.stats, 'valuesOut'),
    ];

    $scope.chartData = [];
    $scope.chartSeries = [];

    $scope.chartLabels = map(get($scope.stats, 'valuesIn'), (value, index) =>
      moment($scope.stats.pointStart)
        .add($scope.stats.pointInterval.standardDays * index, 'days')
        .add($scope.stats.pointInterval.standardHours * index, 'hours')
        .add($scope.stats.pointInterval.standardMinutes * index, 'minutes')
        .format('Y/MM/DD HH:mm:ss'),
    );

    $scope.chartSeries.push(
      $translate.instant('ip_mitigation_statistics_input'),
    );
    $scope.chartSeries.push(
      $translate.instant('ip_mitigation_statistics_output'),
    );

    $scope.chartData.push(
      map(get($scope.stats, 'valuesIn'), (value) => value.y),
    );
    $scope.chartData.push(
      map(get($scope.stats, 'valuesOut'), (value) => value.y),
    );

    $scope.chartOptions = {
      tooltips: {
        callbacks: {
          label: (tooltipItems, data) =>
            `${data.datasets[tooltipItems.datasetIndex].label}: ${
              tooltipItems.yLabel
            } ${$translate.instant('ip_mitigation_statistics_unit_B')} (${
              dataSets[tooltipItems.datasetIndex][tooltipItems.index].formatted
                .value
            } ${
              dataSets[tooltipItems.datasetIndex][tooltipItems.index].formatted
                .unit
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
      IpMitigation.getMitigationRealTimeStatistics(
        $scope.data.ipBlock.ipBlock,
        $scope.data.ip.ip,
      )
        .then((data) => {
          $scope.stats = data;
          if ($scope.stats.noData) {
            clearTO();
          }
        })
        .finally(() => {
          $scope.statsLoading = false;
        });
      timeout = $timeout(() => {
        realTimeStats();
      }, 10000);
    }
  };

  $scope.$watch(
    'stats',
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

  $scope.datePicker = {
    dateFormat: get($locale, 'DATETIME_FORMATS.shortDate'),
    isOpen: false,
    maxDate: new Date(),
  };

  $scope.getStatistics = function getStatistics() {
    if ($scope.model.from && $scope.model.scale) {
      $scope.statsLoading = true;
      IpMitigation.getMitigationStatistics(
        $scope.data.ipBlock.ipBlock,
        $scope.data.ip.ip,
        $scope.model.from.toISOString(),
        $scope.model.scale,
      )
        .then((data) => {
          $scope.stats = data;
        })
        .finally(() => {
          $scope.statsLoading = false;
        });
    }
  };

  $scope.$watch('model.mode', (newValue, oldValue) => {
    if (newValue && (newValue !== oldValue || !$scope.stats)) {
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
};
