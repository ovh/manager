import get from 'lodash/get';

angular.module('App').controller(
  'ReverseDNSDeleteCtrl',
  class ReverseDNSDeleteCtrl {
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

    onDeleteReverseDNSFormSubmit() {
      if (!this.actionEnabled) {
        return this.$state.go('^');
      }

      this.loading.delete = true;

      return this.Server.deleteReverse(
        this.productId,
        this.dedicatedServer.name,
        this.dedicatedServer.ip,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'server_tab_IP_table_delete_reverse_success',
            ),
            'server_dashboard_alert',
          );
          this.$state.go(
            '^',
            {},
            {
              reload: true,
            },
          );
        })
        .catch(({ data }) => {
          this.Alerter.error(
            [
              this.$translate.instant(
                'server_tab_IP_table_delete_reverse_failure',
                {
                  t0: this.newValue,
                },
              ),
              get(data, 'message'),
            ].join('. '),
            'server_dashboard_alert',
          );
          this.$state.go('^');
        })
        .finally(() => {
          this.loading.delete = false;
        });
    }

    $onInit() {
      this.loading = {
        init: false,
        delete: false,
      };
      this.actionEnabled = true;

      this.productId = this.$stateParams.productId;

      this.loading.init = true;
      this.Server.getSelected(this.productId)
        .then((server) => {
          if (server.state === 'OK') {
            this.dedicatedServer = server;
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
