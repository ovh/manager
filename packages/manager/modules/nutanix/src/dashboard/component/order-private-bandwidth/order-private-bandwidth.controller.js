import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import head from 'lodash/head';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import { INTERVAL_UNITS } from './order-private-bandwidth.constants';

export default class NutanixClusterOrderPrivateBandwidthCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    atInternet,
    NutanixClusterOrderPrivateBandwidthService,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.NutanixClusterOrderPrivateBandwidthService = NutanixClusterOrderPrivateBandwidthService;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.model = {};
    this.plans = null;
    this.isLoading = false;
    this.numberOfNodes = this.cluster?.getNodes()?.length;
    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.NutanixClusterOrderPrivateBandwidthService.getNutanixClusterPrivateBandwidthOptions(
            this.serviceId,
          )
            .then((plans) => {
              this.plans = NutanixClusterOrderPrivateBandwidthCtrl.getValidBandwidthPlans(
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
                  'cluster_error_bandwidth_order',
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
          return this.NutanixClusterOrderPrivateBandwidthService.getNutanixClusterPrivateBandwidthOrder(
            this.serviceId,
            this.getPlanDetailsForPayload(),
            this.numberOfNodes,
          )
            .then((res) => {
              res.bandwidth = find(this.plans, {
                planCode: this.model.plan,
              }).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.handleError(
                error,
                this.$translate.instant(
                  'cluster_error_bandwidth_order',
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
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::cancel`,
      type: 'action',
    });
    this.goBack();
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}_${this.model.plan}::confirm`,
        type: 'action',
      });
      return this.NutanixClusterOrderPrivateBandwidthService.nutanixClusterPrivateBandwidthPlaceOrder(
        this.serviceId,
        this.getPlanDetailsForPayload(),
        this.numberOfNodes,
        this.coreConfig.isRegion('US') ||
          this.model.autoPayWithPreferredPaymentMethod,
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

  getPlanDetailsForPayload() {
    return ((plan) => ({
      planCode: plan.planCode,
      duration: plan.prices[2].duration,
      pricingMode: plan.prices[2].pricingMode,
    }))(this.plans.find((plan) => plan.planCode === this.model.plan));
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
          intervalUnit: INTERVAL_UNITS[plan.prices[2].duration],
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
}
