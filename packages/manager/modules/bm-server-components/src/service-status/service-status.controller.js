import {
  VMS_URL_OTHERS,
  WEATHERMAP_URL,
  MONITORING_STATUSES,
} from './service-status.constants';

export default class BmServerComponentsDashboardServiceStatusController {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    atInternet,
    constants,
    coreConfig,
    Server,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.constants = constants;
    this.coreConfig = coreConfig;
    this.Server = Server;
  }

  $onInit() {
    this.servicesStateLinks = {
      weathermap:
        WEATHERMAP_URL[this.coreConfig.getUser().ovhSubsidiary] ||
        WEATHERMAP_URL.OTHERS,
      vms: this.coreConfig.isRegion('US') ? null : this.getVmsLink(),
      status: this.constants.statusUrl,
    };
  }

  getVmsLink() {
    return (
      this.constants.vmsUrl[this.coreConfig.getUser().ovhSubsidiary] ||
      this.constants.vmsUrl[VMS_URL_OTHERS]
    );
  }

  rebootServer() {
    return this.$state.go(`.reboot`);
  }

  removeHack() {
    return this.Server.removeHack(this.$stateParams.productId)
      .then(() => {
        this.dedicatedServer.$scope.setMessage(
          this.$translate.instant(
            'dedicated_server_dashboard_remove_hack_success',
          ),
          true,
        );
      })
      .catch((data) => {
        this.dedicatedServer.$scope.setMessage(
          this.$translate.instant(
            'dedicated_server_dashboard_remove_hack_fail',
          ),
          {
            ...data.data,
            type: 'ERROR',
          },
        );
      });
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

  onMonitoringUpdateClick() {
    this.atInternet.trackClick({
      name: 'dedicated::dedicated-server::server::dashboard::update-monitoring',
      type: 'action',
    });

    return this.goToMonitoringUpdate();
  }
}
