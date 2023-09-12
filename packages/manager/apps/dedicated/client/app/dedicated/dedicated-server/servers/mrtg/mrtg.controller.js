import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import some from 'lodash/some';

class MrtgCtrl {
  constructor($q, $scope, $stateParams, $translate, Server) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Server = Server;

    this.server = {};

    this.serverStatsLoad = {
      loading: true,
      error: false,
    };

    this.serverStats = {
      model: null,
      modelconst: null,
      networkChoice: null,
      periodeChoice: null,
      typeChoice: null,
      mrtgShow: false,
    };

    this.networks = [];
  }

  $onInit() {
    this.$scope.$on('reloadChart', () => {
      this.getStatistics();
    });

    this.loadStatistics();
  }

  static convertData(list) {
    return map(list, (value) =>
      value.unit === 'bps' ? (value.y / 1024).toFixed(2) : value.y,
    );
  }

  createChart(data) {
    this.series = [];
    this.data = [];
    this.labels = map(get(data, 'download.values'), (value) =>
      moment.unix(value.timestamp).calendar(),
    );
    this.series.push(
      this.$translate.instant('server_tab_STATS_legend_download'),
    );
    this.series.push(this.$translate.instant('server_tab_STATS_legend_upload'));
    this.data.push(MrtgCtrl.convertData(get(data, 'download.values')));
    this.data.push(MrtgCtrl.convertData(get(data, 'upload.values')));

    const { unit } = head(get(data, 'download.values'));
    const yLabel =
      unit === 'bps'
        ? this.$translate.instant(
            'server_configuration_mitigation_statistics_unit_KB',
          )
        : unit;
    this.options = {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: yLabel,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: this.$translate.instant(
                'server_usage_chart_xaxis_label',
              ),
            },
          },
        ],
      },
    };
  }

  loadStatistics() {
    const nameServer = null;
    this.serverStatsLoad.loading = true;
    this.serverStatsLoad.error = false;
    const promises = {
      interfaces: this.Server.getNetworkInterfaces(this.$stateParams.productId),
      statConst: this.Server.getStatisticsConst(),
    };

    this.$q
      .all(promises)
      .then(({ interfaces, statConst }) => {
        const hasVrack = some(
          interfaces,
          (networkInterface) => networkInterface.linkType === 'private',
        );

        this.networks = map(interfaces, (networkInterface) => ({
          id: networkInterface.mac,
          linkType: networkInterface.linkType,
          displayName: this.$translate.instant(
            `server_tab_stats_network_${networkInterface.linkType}`,
            {
              t0: networkInterface.mac,
            },
          ),
          disabled: networkInterface.disabled,
        }));

        if (!hasVrack) {
          this.networks.push({
            id: null,
            linkType: 'no_vrack',
            displayName: this.$translate.instant(
              `server_tab_stats_network_no_vrack`,
            ),
            disabled: true,
          });
        }

        this.serverStats.networkChoice = this.networks[0].id;

        this.serverStats.modelconst = statConst;

        if (this.serverStats.periodeChoice === null) {
          this.serverStats.periodeChoice = statConst.defaultPeriod;
        }

        if (this.serverStats.typeChoice === null) {
          this.serverStats.typeChoice = statConst.defaultType;
        }

        return this.getServerStatistics();
      })
      .then((statistics) => {
        this.serverStats.model = statistics;
        this.createChart(statistics);
      })
      .catch((data) => {
        this.serverStatsLoad.error = true;

        if (nameServer && data) {
          this.dedicatedServer.setMessage(
            this.$translate.instant('server_tab_STATS_loading_fail'),
            {
              ...data.data,
              typpe: 'ERROR',
            },
          );
        }
      })
      .finally(() => {
        this.serverStatsLoad.loading = false;
      });
  }

  getServerStatistics() {
    return this.Server.getStatistics(
      this.$stateParams.productId,
      this.serverStats.networkChoice,
      this.serverStats.typeChoice,
      this.serverStats.periodeChoice,
    );
  }

  getStatistics() {
    this.serverStatsLoad.loading = true;
    this.serverStatsLoad.error = false;
    this.getServerStatistics()
      .then((statistics) => {
        this.serverStats.model = statistics;
        this.createChart(statistics);
      })
      .catch((data) => {
        this.serverStatsLoad.error = true;
        if (data) {
          this.dedicatedServer.setMessage(
            this.$translate.instant('server_tab_STATS_loading_fail'),
            {
              ...data.data,
              type: 'ERROR',
            },
          );
        }
      })
      .finally(() => {
        this.serverStatsLoad.loading = false;
      });
  }
}

angular.module('App').controller('MrtgCtrl', MrtgCtrl);
