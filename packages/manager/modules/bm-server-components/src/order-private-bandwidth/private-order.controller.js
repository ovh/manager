import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import head from 'lodash/head';
import compact from 'lodash/compact';
import filter from 'lodash/filter';

export default class BmServerComponentsOrderPrivateBandwidthCtrl {
  /* @ngInject */
  constructor($translate, $window, OrderPrivateBandwidthService, coreConfig) {
    this.$window = $window;
    this.OrderPrivateBandwidthService = OrderPrivateBandwidthService;
    this.region = coreConfig.getRegion();
    this.$translate = $translate;
  }

  $onInit() {
    this.model = {};
    this.plans = null;
    this.isLoading = true;
    this.isInitializing = true;

    this.OrderPrivateBandwidthService.getBareMetalPrivateBandwidthOptions(
      this.serviceId,
    )
      .then((plans) => {
        this.plans = BmServerComponentsOrderPrivateBandwidthCtrl.getValidBandwidthPlans(
          plans,
        );
        this.plans.sort(
          (a, b) =>
            a.prices.find((el) => el.capacities.includes('renew'))
              .priceInUcents -
            b.prices.find((el) => el.capacities.includes('renew'))
              .priceInUcents,
        );
      })
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.isLoading = false;
        this.isInitializing = false;
      });
    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.OrderPrivateBandwidthService.getBareMetalPrivateBandwidthOrder(
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
            .catch((error) => this.handleError(error))
            .finally(() => {
              this.isLoading = false;
            });
        },
      },
    ];
  }

  initSecondStep() {
    this.steps[1].load();
  }

  cancel() {
    this.trackClick(`${this.trackingPrefix}cancel`);
    this.goBack();
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.trackClick(`${this.trackingPrefix}confirm`);
      return this.OrderPrivateBandwidthService.bareMetalPrivateBandwidthPlaceOrder(
        this.serviceId,
        this.model.plan,
        this.getServiceUpgradeParams(),
      )
        .then((result) => {
          this.model.orderUrl = result.order.url;
        })
        .catch((error) => this.handleError(error))
        .finally(() => {
          this.isLoading = false;
        });
    }
    return null;
  }

  seeOrder() {
    this.$window.open(this.model.orderUrl, '_blank');
  }

  static getIntervalUnit(duration) {
    switch (duration.slice(-1)) {
      case 'h': {
        return 'hour';
      }
      case 'Y': {
        return 'year';
      }
      default: {
        return 'month';
      }
    }
  }

  static getValidBandwidthPlans(plans) {
    const list = map(plans, (plan) => {
      // Not to include already included plans (existing plan)
      if (!plan.planCode.includes('included')) {
        // Extract bandwidth value from product name
        const bandwidth = parseInt(
          head(filter(plan.productName.split('-'), (ele) => /^\d+$/.test(ele))),
        );
        return {
          ...plan,
          bandwidth,
          prices: plan.prices.map((price) => {
            if (price.capacities.includes('renew')) {
              return {
                ...price,
                intervalUnit: BmServerComponentsOrderPrivateBandwidthCtrl.getIntervalUnit(
                  price.duration,
                ),
              };
            }
            return price;
          }),
        };
      }
      return null;
    });
    return compact(list);
  }

  handleError(error) {
    const message = this.$translate.instant('server_error_bandwidth_order', {
      error: error.data?.message,
    });

    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error },
      });
    }

    this.goBack(true);
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message,
      });
    }
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
