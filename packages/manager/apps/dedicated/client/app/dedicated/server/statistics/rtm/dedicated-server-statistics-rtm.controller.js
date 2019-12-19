import assign from 'lodash/assign';
import findIndex from 'lodash/findIndex';

angular.module('controllers').controller('controllers.Server.Stats.Rtm', ($rootScope, $scope, $location, $stateParams, Server) => {
  $scope.loadingAction = 'loading';

  $scope.optionsRtm = [
    {
      label: 'cpu',
      type: 'charts',
      period: true,
      data: {
        type: 'cpu',
      },
    },
    {
      label: 'memory',
      type: 'charts',
      period: true,
      data: {
        type: 'memory',
      },
    },
    {
      label: 'swap',
      type: 'charts',
      period: true,
      data: {
        type: 'swap',
      },
    },
    {
      label: 'loadavg',
      type: 'rtm/load-avg/dedicated-server-statistics-rtm-load-avg',
      period: true,
      data: null,
    },
  ];

  $scope.rtmInfo = null;

  $scope.periods = ['daily', 'weekly', 'monthly', 'yearly'];

  $scope.selectedPeriod = {
    value: $scope.periods[0],
  };

  $scope.rtmOptions = {
    value: $scope.optionsRtm[0],
  };

  $scope.selectedTab = {
    value: 'infos',
  };

  $scope.selectTab = function selectTab(_value) {
    let value = _value;

    if (value !== 'infos' && value !== 'disk') {
      value = 'usage';
    }
    $scope.selectedTab.value = value;
  };

  $scope.changePeriod = function changePeriod() {
    $rootScope.$broadcast('reloadChart');
  };

  $scope.changeRtmOptions = function changeRtmOptions() {
    if ($scope.rtmOptions.value.type === 'charts') {
      $rootScope.$broadcast('reloadChart');
    }
    $location.hash('rtmData');
  };

  $scope.openRtmData = function openRtmData() {
    if ($scope.rtmShow) {
      $rootScope.$broadcast('chart.reflow', 'chartRtm');
      $location.hash('rtmData');
    } else {
      $location.hash('stats');
    }
  };

  $scope.$on('rtmChartLoaded', () => {
    $location.hash('rtmCharts');
  });

  $scope.switchOptionRtm = function switchOptionRtm(type) {
    if ($scope.rtmOptions.value && $scope.rtmOptions.value.type === type) {
      return;
    }

    const index = findIndex($scope.optionsRtm, (option) => option.type === type);

    if (~index) {
      $scope.rtmOptions.value = $scope.optionsRtm[index];
      $scope.changeRtmOptions();
    }
  };

  function init() {
    $scope.rtmMissing = false;
    $scope.loadInfo = {};

    Server.getSelected($stateParams.productId).then((server) => {
      $scope.server = server;
      Server.getRtmVersion($stateParams.productId).then(
        (rtmInfo) => {
          $scope.rtmInfo = assign({}, rtmInfo.data);
          $scope.rtmInfo.activated = true;
          Server.getLoad($stateParams.productId).then((loadInfo) => {
            $scope.loadInfo = loadInfo;

            if (loadInfo.uptime !== null) {
              const uptimeM = moment.duration(loadInfo.uptime, 'seconds');

              $scope.uptime = {
                y: uptimeM.years(),
                mo: uptimeM.months(),
                d: uptimeM.days(),
                h: uptimeM.hours(),
                m: uptimeM.minutes(),
                s: uptimeM.seconds(),
              };
            } else {
              $scope.uptime = null;
            }

            Server.getRaidInfo($stateParams.productId).then((infoRaid) => {
              $scope.loadInfo = angular.extend($scope.loadInfo, { raidInfo: infoRaid });
              $scope.loadingAction = 'done';
            });
          });
        },
        (error) => {
          if (error.status === 404) {
            $scope.rtmMissing = true;
          } else {
            $scope.serverStats.mrtgShow = true;
          }
          $scope.loadingAction = 'error';
        },
      );
    });

    $scope.rtmUrl = Server.getRtmHowtoUrl();
  }

  init();
});
