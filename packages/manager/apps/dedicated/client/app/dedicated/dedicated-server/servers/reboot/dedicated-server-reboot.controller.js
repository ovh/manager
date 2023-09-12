angular.module('App').controller(
  'DedicatedServerRebootCtrl',
  class DedicatedServerRebootCtrl {
    constructor($q, $scope, $stateParams, $state, $translate, Alerter, Server) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    $onInit() {
      this.server = null;
      this.isLoading = false;
      this.isRebooting = false;

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
     * Reboot the server.
     * @return {Promise}
     */
    reboot() {
      this.isRebooting = true;

      return this.Server.reboot(this.$stateParams.productId)
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('server_configuration_reboot_success', {
              t0: this.server.name,
            }),
            'server_dashboard_alert',
          );
          return this.close();
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('server_configuration_reboot_fail'),
            'server_dashboard_alert',
          );
          this.$q.reject(err);
          return this.cancel(err);
        })
        .finally(() => {
          this.isRebooting = false;
        });
    }

    close() {
      return this.$state.go('^');
    }
  },
);
