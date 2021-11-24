import get from 'lodash/get';
import map from 'lodash/map';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Cdn,
  CdnDomain,
) => {
  $scope.model = null;
  $scope.consts = null;
  $scope.loadingStats = false;
  $scope.loadingConsts = false;

  $scope.options = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: $translate.instant('unit_size_GB'),
          },
        },
      ],
    },
  };

  $scope.requestOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: $translate.instant(
              'cdn_statistics_requests_per_second',
            ),
          },
        },
      ],
    },
  };

  function createChart(data) {
    $scope.series = [];
    $scope.data = [];

    $scope.labels = map(get(data, 'cdn.values'), (value, index) => {
      const source = data.backend || data.cdn;
      const start = get(source, 'pointStart');
      const interval = get(source, 'pointInterval.standardSeconds');
      return moment(start)
        .add((index + 1) * interval, 'seconds')
        .calendar();
    });
    $scope.series.push(
      $translate.instant(
        `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_cdn`,
      ),
    );
    $scope.series.push(
      $translate.instant(
        `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_backend`,
      ),
    );
    if ($scope.model.dataType === 'REQUEST') {
      $scope.data.push(map(get(data, 'cdn.values'), (value) => value.y));
      $scope.data.push(map(get(data, 'backend.values'), (value) => value.y));
    } else if (
      $scope.model.dataType === 'BANDWIDTH' ||
      $scope.model.dataType === 'QUOTA'
    ) {
      $scope.data.push(
        map(get(data, 'cdn.values'), (value) => value.y / 1000000000),
      ); // convert B to GB
      $scope.data.push(
        map(get(data, 'backend.values'), (value) => value.y / 1000000000),
      );
    }
  }

  $scope.getStatistics = () => {
    $scope.loadingStats = true;
    return Cdn.getStatistics($stateParams.productId, $scope.model)
      .then((data) => createChart(data))
      .finally(() => {
        $scope.loadingStats = false;
      });
  };

  function init() {
    $scope.loadingConsts = true;
    CdnDomain.getSelected($stateParams.productId, $stateParams.domain).then(
      (domain) => {
        $scope.model = {
          domain: domain.domain,
        };
        Cdn.getStatisticsConsts(domain).then((data) => {
          $scope.consts = data;
          $scope.model.dataType = data.defaultType;
          $scope.model.period = data.defaultPeriod;
          $scope.loadingConsts = false;
          $scope.getStatistics();
        });
      },
    );
  }

  init();
};
