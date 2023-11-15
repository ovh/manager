export default class ReverseDNSUpdateCtrl {
  /* @ngInject */
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
          this.reverse = server.reverse;
        } else {
          this.actionEnabled = false;
        }
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  onUpdateReverseDNSFormSubmit() {
    if (!this.actionEnabled) {
      return this.$state.go('^');
    }

    this.loading.update = true;

    return this.Server.updateReverse(
      this.productId,
      this.dedicatedServer.name,
      this.dedicatedServer.ip,
      this.reverse,
    )
      .then(() => {
        const promise = this.$state.go(
          '^',
          {},
          {
            reload: true,
          },
        );

        promise.then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'server_tab_IP_table_manage_reverse_success',
            ),
            'server_dashboard_alert',
          );
        });

        return promise;
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
            data?.message,
          ].join('. '),
          'server_dashboard_alert',
        );
        this.$state.go('^');
      });
  }
}
