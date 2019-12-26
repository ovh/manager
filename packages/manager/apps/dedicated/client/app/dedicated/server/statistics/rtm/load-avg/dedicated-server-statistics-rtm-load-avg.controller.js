import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

angular
  .module('controllers')
  .controller(
    'controllers.Server.Stats.Loadavg',
    ($scope, $location, $timeout, $stateParams, Server) => {
      function timestampToDate(timestamp) {
        return moment.unix(timestamp / 1000).calendar();
      }

      function convertData(list) {
        return map(list, (value) => ({
          x: timestampToDate(value[0]),
          y: value[1],
        }));
      }

      function buildChart(data) {
        $scope.series = [];
        $scope.data = [];
        $scope.labels = [];
        angular.forEach(data, (avgData, avgName) => {
          forEach(get(avgData, 'points'), (point) => {
            if ($scope.labels.indexOf(point[0]) === -1) {
              $scope.labels.push(point[0]);
            }
          });
          $scope.series.push(avgName);
          $scope.data.push(convertData(get(avgData, 'points')));
        });
        $scope.labels = map(sortBy($scope.labels), (value) =>
          timestampToDate(value),
        );
        $scope.options = {
          legend: {
            display: true,
            position: 'top',
          },
        };
      }

      function init() {
        $scope.loading = true;
        Server.getStatisticsLoadavg($stateParams.productId, {
          period: $scope.selectedPeriod.value,
        })
          .then((data) => {
            buildChart(data);
          })
          .finally(() => {
            $scope.loading = false;
          });
      }

      init();

      $scope.$on('reloadChart', () => {
        init();
      });
    },
  );
