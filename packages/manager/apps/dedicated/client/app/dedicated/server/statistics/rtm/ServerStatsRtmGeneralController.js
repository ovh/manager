import map from 'lodash/map';

angular.module('controllers').controller('controllers.Server.Stats.Rtm.General', (
  $scope, $translate, $stateParams, Server,
) => {
  $scope.loading = true;
  $scope.series = [];
  $scope.labels = null;
  $scope.data = null;
  $scope.options = {
    scales: {
      yAxes: [{
        ticks: {
          max: 100,
          min: 0,
        },
        scaleLabel: {
          display: true,
          labelString: $translate.instant('server_usage_chart_yaxis_label'),
        },
      }],
      xAxes: [{
        type: 'time',
        scaleLabel: {
          display: true,
          labelString: $translate.instant('server_usage_chart_xaxis_label'),
        },
      }],
    },
  };

  function init() {
    $scope.loading = true;
    Server.getStatisticsChart($stateParams.productId, {
      period: $scope.selectedPeriod.value,
      type: $scope.rtmOptions.value.data.type,
    }).then((stats) => {
      $scope.labels = map(stats.points, ([date]) => new Date(date));
      $scope.series = [$scope.rtmOptions.value.data.type];
      $scope.data = [
        map(stats.points, ([date, value]) => ({ x: date, y: value })),
      ];
    }).finally(() => {
      $scope.loading = false;
    });
  }

  init();

  $scope.$on('reloadChart', () => {
    init();
  });
});
