export default class DisplayNameCtrl {
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
          this.displayName = server.displayName;
        } else {
          this.actionEnabled = false;
        }
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  onUpdateDisplayNameFormSubmit() {
    if (!this.actionEnabled) {
      return this.$state.go('^');
    }

    this.loading.update = true;
    let reload = false;

    return this.Server.updateDisplayName({
      serviceId: this.dedicatedServer.serviceId,
      serviceName: this.dedicatedServer.name,
      displayName: this.displayName,
    })
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('server_displaname_edit_success'),
          'server_dashboard_alert',
        );
        this.Server.getServices();
        reload = true;
      })
      .catch(({ data }) => {
        this.Alerter.error(
          [
            this.$translate.instant('server_displaname_edit_failure'),
            data?.message,
          ].join(' '),
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
}
