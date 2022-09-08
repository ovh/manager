angular.module('App').controller(
  'DedicatedServerMonitoringUpdateCtrl',
  class DedicatedServerMonitoringUpdateCtrl {
    constructor($q, $stateParams, $state, Alerter, $translate, Server) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.Alerter = Alerter;
      this.$translate = $translate;
      this.Server = Server;
    }

    $onInit() {
      this.server = null;
      this.isLoading = false;
      this.isUpdating = false;
      this.monitoringOptions = [
        { status: 'disabled', settings: { monitoring: false } },
        {
          status: 'proactive',
          settings: { monitoring: true, noIntervention: false },
        },
        {
          status: 'no-proactive',
          settings: { monitoring: true, noIntervention: true },
        },
      ];

      this.isLoading = true;
      console.log('ZM:: onInit', this);
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
      let monitoringStatus = 'disabled';

      // proactive intervention
      if (monitored && !noIntervention) {
        monitoringStatus = 'proactive';
      }

      // no proactive intervention
      if (monitored && noIntervention) {
        monitoringStatus = 'no-proactive';
      }

      return monitoringStatus;
    }

    preselectOption() {
      this.selectedOption = this.monitoringOptions.find(({ status }) => {
        return status === this.getMonitoringStatus();
      });
    }

    /**
     * Update monitoring.
     * @return {Promise}
     */
    update() {
      const { monitoring, noIntervention } = this.selectedOption.settings;

      this.isUpdating = true;
      return this.Server.updateMonitoring(
        this.$stateParams.productId,
        monitoring,
        noIntervention, // reset no-intervention to monitored value
      )
        .then(() => {
          const monitoringOption =
            !monitoring || noIntervention ? 'no-proactive' : 'proactive';

          this.Alerter.success(
            this.$translate.instant(
              `server_configuration_monitoring_update_modal_update_${monitoringOption}_request_success`,
              {
                serverName: this.server.name,
              },
            ),
            'server_dashboard_alert',
          );

          return this.close();
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant(
              'server_configuration_monitoring_update_modal_update_request_failed',
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

    close() {
      this.$state.go('^');
    }
  },
);
