import get from 'lodash/get';

import {
  MONITORING_STATUSES,
  DC_2_ISO,
  URLS,
  WEATHERMAP_URL,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  VMS_URL_OTHERS,
} from './dashboard.constants';
import { NEW_RANGE, OPERATING_SYSTEM_ENUM } from '../details/server.constants';

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
    this.URLS = URLS;
    this.COMMIT_IMPRESSION_TRACKING_DATA = COMMIT_IMPRESSION_TRACKING_DATA;
    this.RECOMMIT_IMPRESSION_TRACKING_DATA = RECOMMIT_IMPRESSION_TRACKING_DATA;
    this.servicesStateLinks = {
      weathermap:
        WEATHERMAP_URL[this.user.ovhSubsidiary] || WEATHERMAP_URL.OTHERS,
      vms: this.coreConfig.isRegion('US') ? null : this.getVmsLink(),
      status: this.constants.statusUrl,
    };

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
  }

  getVmsLink() {
    return (
      this.constants.vmsUrl[this.user.ovhSubsidiary] ||
      this.constants.vmsUrl[VMS_URL_OTHERS]
    );
  }

  rebootServer() {
    return this.$state.go('app.dedicated-server.server.dashboard.reboot');
  }

  getMonitoringStatus() {
    const { monitored, noIntervention } = this.server;
    let monitoringStatus = MONITORING_STATUSES.DISABLED;

    // proactive intervention
    if (monitored && !noIntervention) {
      monitoringStatus = MONITORING_STATUSES.PROACTIVE;
    }

    // no proactive intervention
    if (monitored && noIntervention) {
      monitoringStatus = MONITORING_STATUSES.NOPROACTIVE;
    }

    return monitoringStatus;
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

  canInstallOs() {
    if (get(this.dedicatedServer, '$scope.disable.installationInProgress')) {
      return false;
    }
    if (this.ola && this.ola.isConfigured()) {
      return !this.server.os;
    }
    return true;
  }

  removeHack() {
    return this.Server.removeHack(this.$stateParams.productId)
      .then(() => {
        this.dedicatedServer.setMessage(
          this.$translate.instant('server_remove_hack_success'),
        );
      })
      .catch((data) => {
        this.dedicatedServer.setMessage(
          this.$translate.instant('server_remove_hack_fail'),
          {
            ...data.data,
            type: 'ERROR',
          },
        );
      });
  }

  onBillingInformationError(error) {
    return this.Alerter.error(error, 'server_dashboard_alert');
  }

  openOsInstallation(type) {
    if (type === 'progress') {
      this.trackPage(`${this.trackingPrefix}::system-installation-progress`);
    } else {
      this.trackPage(`${this.trackingPrefix}::system-install`);
    }
    return this.dedicatedServer.$scope.setAction(
      `installation/${type}/dedicated-server-installation-${type}`,
      {
        server: this.server,
        serverCtrl: this.dedicatedServer,
        user: this.user,
      },
    );
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

  onMonitoringUpdateClick() {
    this.atInternet.trackClick({
      name: 'dedicated::dedicated-server::server::dashboard::update-monitoring',
      type: 'action',
    });

    return this.goToMonitoringUpdate();
  }

  getOperatingSystemLabel() {
    const { os } = this.server;
    if (!os || Object.values(OPERATING_SYSTEM_ENUM).includes(os)) {
      return this.$translate.instant(
        os === OPERATING_SYSTEM_ENUM.BRING_YOUR_OWN_IMAGE
          ? 'server_configuration_distribution_byoi'
          : 'server_configuration_distribution_none',
      );
    }

    return os;
  }
}
