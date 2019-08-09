class ServerOrderBandwidthCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, User, Server) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Server = Server;
    this.User = User;
  }

  $onInit() {
    this.model = {};
    this.data = {};
    this.isLoading = false;
    this.existingBandwidth = this.$scope.currentActionData.bandwidth.bandwidth.OvhToInternet.value;

    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOptions(this.$stateParams.productId, this.existingBandwidth)
            .then((plans) => {
              this.plans = this.Server.getValidBandwidthPlans(plans, this.existingBandwidth);
            })
            .catch((error) => {
              this.$scope.resetAction();
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
            })
            .finally(() => { this.isLoading = false; });
        },
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOrder(this.$stateParams.productId, this.model.plan)
            .then((res) => {
              res.bandwidth = _.find(this.plans, 'planCode', this.model.plan).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.$scope.resetAction();
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
            }).finally(() => { this.isLoading = false; });
        },
      },
    ];
    this.$scope.initFirstStep = this.steps[0].load.bind(this);
    this.$scope.initSecondStep = this.steps[1].load.bind(this);
    this.$scope.order = this.order.bind(this);
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.Server.bareMetalPublicBandwidthPlaceOrder(
        this.$stateParams.productId, this.model.plan, this.model.autoPay,
      ).then((result) => {
        this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_success', {
          t0: result.order.url,
        }), true);
        window.open(result.order.url);
      }).catch((error) => {
        this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
      }).finally(() => {
        this.isLoading = false;
        this.$scope.resetAction();
      });
    }
  }

  close() {
    this.$scope.resetAction();
  }
}
angular.module('App').controller('ServerOrderBandwidthCtrl', ServerOrderBandwidthCtrl);
