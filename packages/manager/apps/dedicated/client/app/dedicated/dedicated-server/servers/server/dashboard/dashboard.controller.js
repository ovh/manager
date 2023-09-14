import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import some from 'lodash/some';

import {
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  HIDE_MRTG_FOR_SERVER_RANGES,
} from './dashboard.constants';
import { NEW_RANGE } from '../server.constants';
import { DC_2_ISO } from '../../servers.constants';

export default class DedicatedServerDashboard {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    atInternet,
    Alerter,
    constants,
    DedicatedServerFeatureAvailability,
    Server,
    coreConfig,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.constants = constants;
    this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
    this.Server = Server;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.COMMIT_IMPRESSION_TRACKING_DATA = COMMIT_IMPRESSION_TRACKING_DATA;
    this.RECOMMIT_IMPRESSION_TRACKING_DATA = RECOMMIT_IMPRESSION_TRACKING_DATA;

    this.server.iso =
      DC_2_ISO[this.server.datacenter.toUpperCase().split('_')[0]];

    this.infoServer = {
      rack: this.server.rack,
      serverId: this.server.serverId,
    };

    this.traffic = {};
    this.trafficOrderables = [];

    this.bandwidthInformationsLoad = {
      loading: true,
    };

    this.pattern = NEW_RANGE.PATTERN;

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

    this.$scope.$on('reloadChart', () => {
      this.getStatistics();
    });

    this.loadStatistics();
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
    this.data.push(
      DedicatedServerDashboard.convertData(get(data, 'download.values')),
    );
    this.data.push(
      DedicatedServerDashboard.convertData(get(data, 'upload.values')),
    );

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

        this.networks = map(stats.interfaces, (networkInterface) => ({
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

        this.serverStats.networkChoice = this.networks[0].id;

        this.serverStats.modelconst = stats.statConst;

        if (this.serverStats.periodeChoice === null) {
          this.serverStats.periodeChoice = stats.statConst.defaultPeriod;
        }

        if (this.serverStats.typeChoice === null) {
          this.serverStats.typeChoice = stats.statConst.defaultType;
        }

        return this.Server.getStatistics(
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

  getStatistics() {
    this.serverStatsLoad.loading = true;
    this.serverStatsLoad.error = false;

    this.Server.getStatistics(
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

  canOrderTraffic() {
    return (
      this.DedicatedServerFeatureAvailability.allowDedicatedServerOrderTrafficOption() &&
      !this.server.isExpired &&
      this.server.canOrderQuota
    );
  }

  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      get(this.trafficInformations.trafficOrderables.data, 'length')
    );
  }

  static convertData(list) {
    return map(list, (value) =>
      value.unit === 'bps' ? (value.y / 1024).toFixed(2) : value.y,
    );
  }

  onBillingInformationError(error) {
    return this.Alerter.error(error, 'server_dashboard_alert');
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name,
      type: 'navigation',
    });
  }

  showSuccessMessage(message) {
    this.Alerter.success(
      this.$translate.instant(message, {
        serverName: this.server.displayName,
      }),
      'server_dashboard_alert',
    );
  }

  showErrorMessage(message, error) {
    this.Alerter.error(
      this.$translate.instant(message, {
        serverName: this.server.displayName,
      }),
      error,
      'server_dashboard_alert',
    );
  }

  onChangeIntervention(noIntervention) {
    const { monitored } = this.server;
    this.updatingNoIntervention = true;
    return this.Server.updateMonitoring(
      this.serverName,
      monitored,
      noIntervention,
    )
      .then(() =>
        noIntervention
          ? this.showSuccessMessage(
              'server_configuration_intervention_deactivate_success',
            )
          : this.showSuccessMessage(
              'server_configuration_intervention_activate_success',
            ),
      )
      .catch((err) => {
        this.server.noIntervention = !noIntervention;
        return noIntervention
          ? this.showErrorMessage(
              'server_configuration_intervention_deactivate_failed',
              err,
            )
          : this.showErrorMessage(
              'server_configuration_intervention_activate_failed',
              err,
            );
      })
      .finally(() => {
        this.updatingNoIntervention = false;
      });
  }

  displayMRTG() {
    return !HIDE_MRTG_FOR_SERVER_RANGES.includes(
      this.technicalDetails?.server?.range,
    );
  }
}
