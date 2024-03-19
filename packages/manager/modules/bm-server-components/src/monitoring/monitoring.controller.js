import { MONITORING_STATUSES } from './monitoring.constants';

export default class DedicatedServerMonitoringCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, atInternet, Alerter, Server) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.Server = Server;
  }

  $onInit() {
    this.server = null;
    this.isLoading = false;
    this.isUpdating = false;
    this.monitoringOptions = [
      {
        status: 'disabled',
        settings: { monitoring: false },
        tracking: 'disabled',
      },
      {
        status: 'proactive',
        settings: { monitoring: true, noIntervention: false },
        tracking: 'enable-with-intervention',
      },
      {
        status: 'no-proactive',
        settings: { monitoring: true, noIntervention: true },
        tracking: 'enable-without-intervention',
      },
    ];

    this.isLoading = true;
    return this.Server.getSelected(this.$stateParams.productId)
      .then((server) => {
        this.server = server;
        this.preselectOption();
      })
      .catch((err) => {
        this.$q.reject(err);
        return this.cancel(err);
      })
      .finally(() => {
        this.isLoading = false;
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

  preselectOption() {
    this.selectedOption = this.monitoringOptions.find(({ status }) => {
      return status === this.getMonitoringStatus();
    });
  }

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: `dedicated::dedicated-server::${this.serverType}::dashboard::monitoringUpdate::${hit}`,
      type: 'action',
    });
  }

  trackConfirmClick(hit) {
    return this.atInternet.trackClick({
      name: `dedicated-server::monitoring-update-confirm::${hit}`,
      type: 'action',
    });
  }

  trackBannerMessages(statusHit, monitoringOptionHit) {
    return this.atInternet.trackClick({
      name: `dedicated-server::monitoring-update-banner::${statusHit}::${monitoringOptionHit}`,
      type: 'action',
    });
  }

  /**
   * Update monitoring.
   * @return {Promise}
   */
  update() {
    this.trackClick('confirm');
    this.trackConfirmClick(this.selectedOption.tracking);

    const { monitoring, noIntervention } = this.selectedOption.settings;

    this.isUpdating = true;
    return this.Server.updateMonitoring(
      this.$stateParams.productId,
      monitoring,
      noIntervention, // reset no-intervention to monitored value
    )
      .then(() => {
        this.trackBannerMessages('success', this.selectedOption.tracking);

        const monitoringOption =
          !monitoring || noIntervention ? 'no-proactive' : 'proactive';

        this.Alerter.success(
          this.$translate.instant(
            `server_monitoring_modal_update_${monitoringOption}_request_success`,
            {
              serverName: this.server.name,
            },
          ),
          'server_dashboard_alert',
        );

        return this.goBack();
      })
      .catch((err) => {
        this.trackBannerMessages('error', this.selectedOption.tracking);

        this.Alerter.error(
          this.$translate.instant(
            'server_monitoring_modal_update_request_failed',
          ),
          err,
          'server_dashboard_alert',
        );
        return this.cancel(err);
      })
      .finally(() => {
        this.isUpdating = false;
      });
  }

  onCloseClick() {
    this.trackClick('cancel');
    return this.goBack();
  }
}
