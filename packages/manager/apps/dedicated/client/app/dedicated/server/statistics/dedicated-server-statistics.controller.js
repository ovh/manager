import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';

angular.module('controllers').controller('controllers.Server.Stats', (
  $q,
  $scope,
  $state,
  $stateParams,
  $translate,
  Alerter,
  BandwidthVrackOrderService,
  dedicatedServerFeatureAvailability,
  Server,
  ServerOrderTrafficService,
  ServerTrafficService,
  NEW_RANGE,
) => {
  $scope.pattern = NEW_RANGE.PATTERN;
  $scope.currentView = {
    value: 'DASHBOARD',
  };

  $scope.serverStatsLoad = {
    loading: true,
    error: false,
  };

  $scope.serverStats = {
    model: null,
    modelconst: null,
    networkChoice: null,
    periodeChoice: null,
    typeChoice: null,
    mrtgShow: false,
  };

  $scope.networks = [];

  $scope.traffic = {};
  $scope.trafficOrderables = [];

  $scope.bandwidthInformationsLoad = {
    loading: true,
  };

  /* eslint-disable no-return-assign, max-len */
  $scope.loadBandwidthInformations = function loadBandwidthInformations() {
    $q
      .all([
        Server.getBandwidth($stateParams.productId)
          .then(bandwidth => ($scope.bandwidth = bandwidth))
          .then(data => Server.getBandwidthOption($stateParams.productId, data))
          .then(bandwidthOption => ($scope.bandwidthOption = bandwidthOption)),
        Server.getBandwidthVrackOption($stateParams.productId).then(bandwidthVrackOption => ($scope.bandwidthVrackOption = bandwidthVrackOption)),
        BandwidthVrackOrderService.getOrderableBandwidths($stateParams.productId).then(bandwidthVrackOptions => ($scope.bandwidthVrackOrderOptions = bandwidthVrackOptions)),
        ServerTrafficService.getTraffic($stateParams.productId).then(traffic => ($scope.traffic = traffic.data)),
        ServerOrderTrafficService.getOrderables($stateParams.productId).then(trafficOrderables => ($scope.trafficOrderables = trafficOrderables.data)),
        ServerOrderTrafficService.getOption($stateParams.productId).then(trafficOption => ($scope.trafficOption = trafficOption.data)),
      ])
      .catch(data => Alerter.alertFromSWS($translate.instant('server_bandwidth_loading_error'), data.data, 'bandwithError'))
      .finally(() => {
        $scope.bandwidthInformationsLoad = false;
      });
  };
  /* eslint-disable no-return-assign, max-len */

  $scope.canOrderVrackBandwidth = () => dedicatedServerFeatureAvailability.allowDedicatedServerOrderVrackBandwidthOption() && !$scope.server.isExpired && $scope.server.canOrderVrackBandwith;
  $scope.canOrderMoreVrackBandwidth = () => !$scope.server.isExpired && $scope.server.canOrderVrackBandwith && $scope.bandwidthVrackOrderOptions.data.length;

  $scope.canOrderTraffic = () => dedicatedServerFeatureAvailability.allowDedicatedServerOrderTrafficOption() && !$scope.server.isExpired && $scope.server.canOrderQuota;
  $scope.canOrderMoreTraffic = () => !$scope.server.isExpired && $scope.server.canOrderQuota && get($scope.trafficOrderables, 'length');

  $scope.isFullAgora = commercialRange => $scope.pattern.test(commercialRange);

  $scope.$on('dedicated.informations.bandwidth', $scope.loadBandwidthInformations);

  function convertData(list) {
    return map(list, value => (value.unit === 'bps' ? (value.y / 1024).toFixed(2) : value.y));
  }

  function createChart(data) {
    $scope.series = [];
    $scope.data = [];
    $scope.labels = map(get(data, 'download.values'), value => moment.unix(value.timestamp).calendar());
    $scope.series.push($translate.instant('server_tab_STATS_legend_download'));
    $scope.series.push($translate.instant('server_tab_STATS_legend_upload'));
    $scope.data.push(convertData(get(data, 'download.values')));
    $scope.data.push(convertData(get(data, 'upload.values')));
    const { unit } = head(get(data, 'download.values'));
    const yLabel = unit === 'bps' ? $translate.instant('server_configuration_mitigation_statistics_unit_KB') : unit;
    $scope.options = {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yLabel,
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: $translate.instant('server_usage_chart_xaxis_label'),
          },
          ticks: {
            // This is default value according to doc but needs to dig why it's not applied
            maxTicksLimit: 11,
          },
        }],
      },
    };
  }

  /**
   * LOADER
   */
  $scope.loadStatistics = function loadStatistics() {
    const nameServer = null;
    $scope.serverStatsLoad.loading = true;
    $scope.serverStatsLoad.error = false;
    const promises = {
      interfaces: Server.getNetworkInterfaces($stateParams.productId),
      statConst: Server.getStatisticsConst(),
    };

    $q.all(promises)
      .then((stats) => {
        const hasVrack = some(stats.interfaces, networkInterface => networkInterface.linkType === 'private');
        if (!hasVrack) {
          stats.interfaces.push({
            linkType: 'no_vrack',
            disabled: true,
          });
        }

        $scope.networks = map(stats.interfaces, networkInterface => ({
          id: networkInterface.mac,
          linkType: networkInterface.linkType,
          displayName: $translate.instant(`server_tab_stats_network_${networkInterface.linkType}`, {
            t0: networkInterface.mac,
          }),
          disabled: networkInterface.disabled,
        }));

        $scope.serverStats.networkChoice = $scope.networks[0].id;

        $scope.serverStats.modelconst = stats.statConst;
        if ($scope.serverStats.periodeChoice === null) {
          $scope.serverStats.periodeChoice = stats.statConst.defaultPeriod;
        }
        if ($scope.serverStats.typeChoice === null) {
          $scope.serverStats.typeChoice = stats.statConst.defaultType;
        }

        return Server.getStatistics($stateParams.productId, $scope.serverStats.networkChoice, $scope.serverStats.typeChoice, $scope.serverStats.periodeChoice);
      })
      .then((statistics) => {
        $scope.serverStats.model = statistics;
        createChart(statistics);
      })
      .catch((data) => {
        $scope.serverStatsLoad.error = true;
        if (nameServer && data) {
          set(data, 'data.type', 'ERROR');
          $scope.setMessage($translate.instant('server_tab_STATS_loading_fail'), data.data);
        }
      })
      .finally(() => {
        $scope.serverStatsLoad.loading = false;
      });
  };

  $scope.removeHack = function removeHack() {
    Server.removeHack($stateParams.productId).then(
      () => {
        $scope.setMessage($translate.instant('server_remove_hack_success'));
      },
      (data) => {
        set(data, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_remove_hack_fail'), data.data);
      },
    );
  };

  $scope.rebootServer = function rebootServer() {
    return $state.go('app.dedicated.server.dashboard.reboot');
  };

  $scope.$on('reloadChart', () => {
    $scope.getStatistics();
  });

  $scope.getStatistics = function getStatistics() {
    $scope.serverStatsLoad.loading = true;
    $scope.serverStatsLoad.error = false;
    Server.getStatistics($stateParams.productId, $scope.serverStats.networkChoice, $scope.serverStats.typeChoice, $scope.serverStats.periodeChoice)
      .then((statistics) => {
        $scope.serverStats.model = statistics;
        createChart(statistics);
      })
      .catch((data) => {
        $scope.serverStatsLoad.error = true;
        if (data) {
          set(data, 'type', 'ERROR');
          $scope.setMessage($translate.instant('server_tab_STATS_loading_fail'), data.data);
        }
      })
      .finally(() => {
        $scope.serverStatsLoad.loading = false;
      });
  };

  $scope.loadStatistics();
  $scope.loadBandwidthInformations();
});
