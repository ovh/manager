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
    this.isLoading = false;

    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.OrderPrivateBandwidthService.getBareMetalPrivateBandwidthOptions(
            this.serverName,
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
            .catch((error) => {
              this.handleError(
                error,
                this.$translate.instant(
                  'server_error_bandwidth_order',
                  error.data,
                ),
              );
              this.goBack();
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
          return this.OrderPrivateBandwidthService.getBareMetalPrivateBandwidthOrder(
            this.serverName,
            this.model.plan,
          )
            .then((res) => {
              res.bandwidth = find(
                this.plans,
                'planCode',
                this.model.plan,
              ).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.handleError(
                error,
                this.$translate.instant(
                  'server_error_bandwidth_order',
                  error.data,
                ),
              );
              this.goBack();
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
    this.steps[1].load();
  }

  cancel() {
    this.atTrack(`${this.trackingPrefix}cancel`);
    this.goBack();
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.atTrack(`${this.trackingPrefix}confirm`);
      return this.OrderPrivateBandwidthService.bareMetalPrivateBandwidthPlaceOrder(
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
    return null;
  }

  seeOrder() {
    this.$window.open(this.model.orderUrl, '_blank');
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
        };
      }
      return null;
    });
    return compact(list);
  }

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error },
      });
    }
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message,
      });
    }
  }
}
