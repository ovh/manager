import head from 'lodash/head';
import last from 'lodash/last';
import map from 'lodash/map';
import round from 'lodash/round';

angular.module('controllers').controller('controllers.Server.Stats.Rtm.General', (
  $scope, $translate, $stateParams, Server,
) => {
  $scope.loading = true;
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
      $scope.labels = map(stats.points, point => new Date(head(point)));
      $scope.data = map(stats.points, point => round(last(point), 2));
    }).finally(() => {
      $scope.loading = false;
    });
  }

  init();

  $scope.$on('reloadChart', () => {
    init();
  });
});
