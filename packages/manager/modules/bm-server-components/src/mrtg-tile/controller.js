import head from 'lodash/head';
import some from 'lodash/some';
import { formatRelative, fromUnixTime } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { detectUserLocale } from '@ovh-ux/manager-config';

export default class BmServerComponentsMrtgTileController {
  /* @ngInject */
  constructor($q, $scope, $stateParams, $translate, ChartFactory) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.ChartFactory = ChartFactory;
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
    this.$scope.$on('reloadChart', () => {
      this.getStatistics();
    });

    return this.loadStatistics();
  }

  createChart(data) {
    const { unit } = head(data?.download.values);
    const yLabel =
      unit === 'bps' ? this.$translate.instant('server_mrtg_unit_KB') : unit;

    this.mrtgChart = new this.ChartFactory({
      data: {
        datasets: [
          {
            label: this.$translate.instant('server_mrtg_legend_download'),
            data: BmServerComponentsMrtgTileController.convertData(
              data?.download.values,
            ),
          },
          {
            label: this.$translate.instant('server_mrtg_legend_upload'),
            data: BmServerComponentsMrtgTileController.convertData(
              data?.upload.values,
            ),
          },
        ],
        labels: data?.download.values.map(({ timestamp }) =>
          formatRelative(fromUnixTime(timestamp), new Date(), {
            locale: BmServerComponentsMrtgTileController.getDateFnsLocale(),
          }),
        ),
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: yLabel,
            },
          },
          x: {
            title: {
              display: true,
              text: this.$translate.instant('server_mrtg_chart_xaxis_label'),
            },
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
      },
    });
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

  static getDateFnsLocale() {
    const language = detectUserLocale();
    if (language === 'en_GB') {
      return dateFnsLocales.enGB;
    }
    if (language === 'fr_CA') {
      return dateFnsLocales.frCA;
    }
    const [locale] = language.split('_');
    return dateFnsLocales[locale];
  }
}
