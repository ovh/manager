import get from 'lodash/get';

class ServerConsumptionCtrl {
  constructor($q, $scope, $stateParams, $filter, Alerter, ServerTrafficService,
    ServerOrderTrafficService, Server) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.Alerter = Alerter;
    this.ServerTrafficService = ServerTrafficService;
    this.ServerOrderTrafficService = ServerOrderTrafficService;
    this.Server = Server;

    this.server = {};
    this.state = {};
    this.toggles = {};
    this.traffic = {};
    this.trafficOption = {};
    this.trafficOrderables = {};
  }

  $onInit() {
    this.state = {
      nearQuota: false,
      overQuota: false,
      throttled: false,
    };

    this.toggles = {
      consumptionShow: true,
    };

    this.initServer();
    this.initTraffic();
    this.initTrafficOrder();
  }

  initServer() {
    this.server.loading = true;
    return this.Server.getSelected(this.$stateParams.productId)
      .then((server) => {
        this.server.data = server;
        this.server.hasErrors = false;
      })
      .catch(() => {
        this.server.data = {};
        this.server.hasErrors = true;
      })
      .finally(() => {
        this.server.loading = false;
      });
  }

  initTraffic() {
    this.traffic.loading = true;
    this.ServerTrafficService.getTraffic(this.$stateParams.productId)
      .then((traffic) => {
        this.traffic.data = traffic.data;
        this.traffic.hasErrors = false;
      })
      .catch(() => {
        this.traffic.data = {};
        this.traffic.hasErrors = true;
      })
      .finally(() => {
        this.traffic.loading = false;
      });
  }

  initTrafficOrder() {
    this.$q.all([this.initTrafficOption(), this.initTrafficOrderables()]).catch((data) => this.Alerter.alertFromSWS(this.$translate.instant('server_traffic_loading_error'), data.data, 'trafficError'));
  }

  initTrafficOption() {
    this.trafficOption.loading = true;
    return this.ServerOrderTrafficService.getOption(this.$stateParams.productId)
      .then((trafficOption) => {
        this.trafficOption.data = trafficOption.data;
        this.trafficOption.hasErrors = false;
      })
      .catch(() => {
        this.trafficOption.data = {};
        this.trafficOption.hasErrors = true;
      })
      .finally(() => {
        this.trafficOption.loading = false;
      });
  }

  initTrafficOrderables() {
    this.trafficOrderables.loading = true;
    return this.ServerOrderTrafficService.getOrderables(this.$stateParams.productId)
      .then((trafficOrderables) => {
        this.trafficOrderables.data = trafficOrderables.data;
        this.trafficOrderables.hasErrors = false;
      })
      .catch(() => {
        this.trafficOrderables.data = [];
        this.trafficOrderables.hasErrors = true;
      })
      .finally(() => {
        this.trafficOrderables.loading = false;
      });
  }

  canOrderTraffic() {
    return !this.server.data.isExpired && this.server.data.canOrderQuota;
  }

  canOrderMoreTraffic() {
    return !this.server.data.isExpired && this.server.data.canOrderQuota && get(this.trafficOrderables, 'data.length');
  }

  // function quotaStatus () {
  //   $scope.state.throttled = $scope.consumptionData.throttled.status;
  //   if ($scope.state.overQuota) {
  //     Alerter.alertFromSWS([
  //       $translate.instant("server_consumption_warning_overquota", {
  //         t0: $scope.consumptionData.throttled.speed
  //       }),
  //       //$translate.instant("server_consumption_warning_overquota_increase")
  //     ].join(" "), null, $scope.alert);
  //   } else if ($scope.state.nearQuota) {
  //     Alerter.alertFromSWS([
  //       $translate.instant("server_consumption_warning_nearquota", {
  //         t0: $scope.consumption.total.text
  //       }),
  //       //$translate.instant("server_consumption_warning_nearquota_increase")
  //     ].join(" "), null, $scope.alert);
  //   }
  // }
}

angular.module('App').controller('ServerConsumptionCtrl', ServerConsumptionCtrl);
