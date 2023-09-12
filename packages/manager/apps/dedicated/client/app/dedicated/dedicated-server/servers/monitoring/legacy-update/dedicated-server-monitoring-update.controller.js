angular.module('App').controller(
  'DedicatedServerMonitoringLegacyUpdateCtrl',
  class DedicatedServerMonitoringLegacyUpdateCtrl {
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

      this.isLoading = true;
      return this.Server.getSelected(this.$stateParams.productId)
        .then((server) => {
          this.server = server;
        })
        .catch((err) => {
          this.$q.reject(err);
          return this.cancel(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }

    /**
     * Update monitoring.
     * @return {Promise}
     */
    update() {
      const { monitored } = this.server;
      this.isUpdating = true;
      return this.Server.updateMonitoring(
        this.$stateParams.productId,
        !monitored,
        !monitored, // reset no-intervention to monitored value
      )
        .then(() => {
          if (monitored === true) {
            this.Alerter.success(
              this.$translate.instant(
                'server_configuration_monitoring_deactivate_success',
                {
                  t0: this.server.name,
                },
              ),
              'server_dashboard_alert',
            );
          } else {
            this.Alerter.success(
              this.$translate.instant(
                'server_configuration_monitoring_activate_success',
                {
                  t0: this.server.name,
                },
              ),
              'server_dashboard_alert',
            );
          }
          return this.close();
        })
        .catch((err) => {
          if (monitored === true) {
            this.Alerter.error(
              this.$translate.instant(
                'server_configuration_monitoring_deactivate_failed',
                {
                  t0: this.server.name,
                },
              ),
              err,
              'server_dashboard_alert',
            );
          } else {
            this.Alerter.error(
              this.$translate.instant(
                'server_configuration_monitoring_activate_failed',
                {
                  t0: this.server.name,
                },
              ),
              err,
              'server_dashboard_alert',
            );
          }
          this.$q.reject(err);
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
