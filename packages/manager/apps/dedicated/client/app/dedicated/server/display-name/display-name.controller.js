import get from 'lodash/get';

angular.module('App').controller(
  'DisplayNameCtrl',
  class DisplayNameCtrl {
    constructor(
      $scope,
      $state,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      Server,
    ) {
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    onUpdateDisplayNameFormSubmit() {
      if (!this.actionEnabled) {
        return this.$state.go('^');
      }

      this.loading.update = true;
      let reload = false;

      return this.Server.updateDisplayName({
        serviceId: this.dedicatedServer.serviceId,
        displayName: this.displayName,
      })
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'server_tab_IP_table_manage_reverse_success',
            ),
            'server_dashboard_alert',
          );
          this.Server.getServices();
          reload = true;
        })
        .catch(({ data }) => {
          this.Alerter.error(
            [
              this.$translate.instant(
                'server_tab_IP_table_manage_reverse_failure',
                {
                  t0: this.newValue,
                },
              ),
              get(data, 'message'),
            ].join('. '),
            'server_dashboard_alert',
          );
        })
        .finally(() =>
          this.$state.go(
            '^',
            {},
            {
              reload,
            },
          ),
        )
        .finally(() => {
          this.loading.update = false;
        });
    }

    $onInit() {
      this.loading = {
        init: false,
        update: false,
      };
      this.actionEnabled = true;

      this.productId = this.$stateParams.productId;

      this.loading.init = true;
      this.Server.getSelected(this.productId)
        .then((server) => {
          if (server.state === 'OK') {
            this.dedicatedServer = server;
            this.displayName = server.displayName;
          } else {
            this.actionEnabled = false;
          }
        })
        .finally(() => {
          this.loading.init = false;
        });
    }
  },
);
