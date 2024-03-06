import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Cdn,
  ChartFactory,
) => {
  $scope.model = null;
  $scope.consts = null;
  $scope.loadingStats = false;
  $scope.loadingConsts = false;

  $scope.chart = new ChartFactory({
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      plugins: {
        tooltip: {
          mode: 'index',
          interset: false,
        },
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          fill: true,
          borderWidth: 2,
          tension: 0.5,
        },
        point: {
          radius: 2,
        },
      },
      scales: {
        y: {
          min: 0,
          beginAtZero: true,
          title: {
            display: true,
            text: $translate.instant('unit_size_GB'),
          },
        },
      },
    },
  });

  function createChart(data) {
    $scope.chart.data.labels = map(get(data, 'cdn.values'), (value, index) => {
      const source = data.backend || data.cdn;
      const start = get(source, 'pointStart');
      const interval = get(source, 'pointInterval.standardSeconds');
      return moment(start)
        .add((index + 1) * interval, 'seconds')
        .calendar();
    });

    if ($scope.model.dataType === 'REQUEST') {
      $scope.chart.options.scales.y.title.text = $translate.instant(
        'cdn_statistics_requests_per_second',
      );
      $scope.chart.data.datasets = [
        {
          label: $translate.instant(
            `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_cdn`,
          ),
          data: map(get(data, 'cdn.values'), (value) => value.y),
        },
        {
          label: $translate.instant(
            `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_backend`,
          ),
          data: map(get(data, 'backend.values'), (value) => value.y),
        },
      ];
    } else if (
      $scope.model.dataType === 'BANDWIDTH' ||
      $scope.model.dataType === 'QUOTA'
    ) {
      $scope.chart.options.scales.y.title.text = $translate.instant(
        'unit_size_GB',
      );
      $scope.chart.data.datasets = [
        {
          label: $translate.instant(
            `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_cdn`,
          ),
          data: map(get(data, 'cdn.values'), (value) => value.y / 1000000000),
        },
        {
          label: $translate.instant(
            `cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_backend`,
          ),
          data: map(
            get(data, 'backend.values'),
            (value) => value.y / 1000000000,
          ),
        },
      ];
    }
  }

  $scope.getStatistics = () => {
    $scope.loadingStats = true;
    return Cdn.getStatistics($stateParams.productId, $scope.model)
      .then((data) => createChart(data))
      .catch((err) => {
        if (err.message) {
          set(err, 'message', err.message.replace(' : null', ''));
          $scope.setMessage(
            $translate.instant('cdn_configuration_add_ssl_get_error'),
            { type: 'ERROR', message: err.message },
          );
        }
      })
      .finally(() => {
        $scope.loadingStats = false;
      });
  };

  function init() {
    $scope.loadingConsts = true;
    Cdn.getStatisticsConsts()
      .then((data) => {
        $scope.consts = data;
        $scope.model = {
          dataType: data.defaultType,
          period: data.defaultPeriod,
        };
        $scope.getStatistics();
      })
      .finally(() => {
        $scope.loadingConsts = false;
      });
  }

  init();
};
