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
    this.isLoading = true;
    this.isInitializing = true;

    this.Server.getBareMetalPublicBandwidthOptions(this.serviceId)
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
        this.isInitializing = false;
      });

    this.steps = [
      {
        isValid: () =>
          !this.isLoading && (this.plans?.length === 0 || this.model.plan),
        isLoading: () => this.isLoading,
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server.getBareMetalPublicBandwidthOrder(
            this.serviceId,
            this.model.plan,
            this.getServiceUpgradeParams(),
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
        this.serviceId,
        this.model.plan,
        this.getServiceUpgradeParams(),
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

  getServiceUpgradeParams() {
    const renewPrice = this.plans
      .find((plan) => plan.planCode === this.model.plan)
      ?.prices?.find((price) => price.capacities.includes('renew'));
    return {
      autoPayWithPreferredPaymentMethod:
        this.region === 'US' || this.model.autoPay,
      duration: renewPrice?.duration,
      pricingMode: renewPrice?.pricingMode,
      quantity: 1,
    };
  }
}
