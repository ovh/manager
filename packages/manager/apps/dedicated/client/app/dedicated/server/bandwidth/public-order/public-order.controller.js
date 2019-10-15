import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($window, Server) {
    this.$window = $window;
    this.Server = Server;
  }

  $onInit() {
    this.model = {};
    this.plans = null;
    this.isLoading = false;
    this.existingBandwidth = _.get(this, 'specifications.bandwidth.OvhToInternet.value');

    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOptions(this.serverName, this.existingBandwidth)
            .then((plans) => {
              this.plans = this.Server.getValidBandwidthPlans(plans, this.existingBandwidth);
            })
            .catch((error) => {
              this.goBack().then(() => this.alertError('server_error_bandwidth_order', error.data));
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOrder(this.serverName, this.model.plan)
            .then((res) => {
              res.bandwidth = _.find(this.plans, 'planCode', this.model.plan).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.goBack().then(() => this.alertError('server_error_bandwidth_order', error.data));
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
      },
    ];
  }

  initFirstStep() { this.steps[0].load(); }

  initSecondStep() { this.steps[1].load(); }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.Server.bareMetalPublicBandwidthPlaceOrder(
        this.serverName, this.model.plan, this.model.autoPay,
      ).then((result) => {
        this.model.orderUrl = result.order.url;
      }).finally(() => {
        this.isLoading = false;
      });
    }
  }

  seeOrder() {
    this.$window.open(this.model.orderUrl, '_blank');
  }
}
