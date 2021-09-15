import find from 'lodash/find';

export default class {
  /* @ngInject */
  constructor($window, atInternet, Server, coreConfig) {
    this.$window = $window;
    this.atInternet = atInternet;
    this.Server = Server;
    this.region = coreConfig.getRegion();
  }

  $onInit() {
    this.model = {};
    this.plans = null;
    this.isLoading = false;

    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server.getBareMetalPublicBandwidthOptions(this.serverName)
            .then((plans) => {
              this.plans = this.Server.getValidBandwidthPlans(plans);
              this.plans.sort(
                (a, b) =>
                  a.prices.find((el) => el.capacities.includes('renew'))
                    .priceInUcents -
                  b.prices.find((el) => el.capacities.includes('renew'))
                    .priceInUcents,
              );
            })
            .catch((error) => {
              this.goBack().then(() =>
                this.alertError('server_error_bandwidth_order', error.data),
              );
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
          return this.Server.getBareMetalPublicBandwidthOrder(
            this.serverName,
            this.model.plan,
          )
            .then((res) => {
              res.bandwidth = find(this.plans, {
                planCode: this.model.plan,
              }).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.goBack().then(() =>
                this.alertError('server_error_bandwidth_order', error.data),
              );
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
      },
    ];
  }

  initFirstStep() {
    this.steps[0].load();
  }

  initSecondStep() {
    this.atInternet.trackClick({
      name: `dedicated::server::${this.model.plan}::next`,
      type: 'action',
    });
    this.steps[1].load();
  }

  order() {
    this.atInternet.trackClick({
      name: `dedicated::server::${this.model.plan}::pay`,
      type: 'action',
    });
    if (this.model.plan) {
      this.isLoading = true;
      this.atTrack(`${this.trackingPrefix}confirm`);
      this.Server.bareMetalPublicBandwidthPlaceOrder(
        this.serverName,
        this.model.plan,
        this.region === 'US' || this.model.autoPay,
      )
        .then((result) => {
          this.model.orderUrl = result.order.url;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  cancel() {
    this.atTrack(`${this.trackingPrefix}cancel`);
    this.goBack();
  }

  seeOrder() {
    this.$window.open(this.model.orderUrl, '_blank');
  }
}
