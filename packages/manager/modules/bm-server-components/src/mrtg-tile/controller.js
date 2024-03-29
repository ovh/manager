import head from 'lodash/head';
import some from 'lodash/some';
import moment from 'moment';
import { detectUserLocale } from '@ovh-ux/manager-config';

export default class BmServerComponentsMrtgTileController {
  /* @ngInject */
  constructor($q, $scope, $stateParams, $translate) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
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
  }

  $onInit() {
    moment.locale(detectUserLocale());
    this.$scope.$on('reloadChart', () => {
      this.getStatistics();
    });

    return this.loadStatistics();
  }

  createChart(data) {
    this.series = [];
    this.data = [];
    this.labels = data?.download.values.map((value) =>
      moment.unix(value.timestamp).calendar(),
    );
    this.series.push(this.$translate.instant('server_mrtg_legend_download'));
    this.series.push(this.$translate.instant('server_mrtg_legend_upload'));
    this.data.push(
      BmServerComponentsMrtgTileController.convertData(data?.download.values),
    );
    this.data.push(
      BmServerComponentsMrtgTileController.convertData(data?.upload.values),
    );

    const { unit } = head(data?.download.values);
    const yLabel =
      unit === 'bps' ? this.$translate.instant('server_mrtg_unit_KB') : unit;
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
                'server_mrtg_chart_xaxis_label',
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
      interfaces: this.serverService.getNetworkInterfaces(
        this.$stateParams.productId,
      ),
      statConst: this.serverService.getStatisticsConst(),
    };

    this.$q
      .all(promises)
      .then((stats) => {
        const hasVrack = some(
          stats.interfaces,
          (networkInterface) => networkInterface.linkType === 'private',
        );

        if (!hasVrack) {
          stats.interfaces.push({
            linkType: 'no_vrack',
            disabled: true,
          });
        }

        this.networks = stats.interfaces.map((networkInterface) => {
          const { mac, linkType, disabled } = networkInterface;
          return {
            id: mac,
            linkType,
            displayName:
              linkType === 'no_vrack'
                ? this.$translate.instant(`server_mrtg_network_${linkType}`, {
                    t0: mac,
                  })
                : mac,
            disabled,
          };
        });

        this.serverStats.networkChoice = this.networks[0].id;

        this.serverStats.modelconst = stats.statConst;

        if (this.serverStats.periodeChoice === null) {
          this.serverStats.periodeChoice = stats.statConst.defaultPeriod;
        }

        if (this.serverStats.typeChoice === null) {
          this.serverStats.typeChoice = stats.statConst.defaultType;
        }

        return this.serverService.getStatistics(
          this.$stateParams.productId,
          this.serverStats.networkChoice,
          this.serverStats.typeChoice,
          this.serverStats.periodeChoice,
        );
      })
      .then((statistics) => {
        this.serverStats.model = statistics;
        this.createChart(statistics);
      })
      .catch((data) => {
        this.serverStatsLoad.error = true;

        if (nameServer && data) {
          this.dedicatedServer.setMessage(
            this.$translate.instant('server_mrtg_loading_fail'),
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

  getStatistics() {
    this.serverStatsLoad.loading = true;
    this.serverStatsLoad.error = false;

    this.serverService
      .getStatistics(
        this.$stateParams.productId,
        this.serverStats.networkChoice,
        this.serverStats.typeChoice,
        this.serverStats.periodeChoice,
      )
      .then((statistics) => {
        this.serverStats.model = statistics;
        this.createChart(statistics);
      })
      .catch((data) => {
        this.serverStatsLoad.error = true;
        if (data) {
          this.dedicatedServer.setMessage(
            this.$translate.instant('server_mrtg_loading_fail'),
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

  static convertData(list) {
    return list.map((value) =>
      value.unit === 'bps' ? (value.y / 1024).toFixed(2) : value.y,
    );
  }
}
