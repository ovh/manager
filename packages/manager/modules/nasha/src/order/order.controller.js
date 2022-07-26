import JSURL from 'jsurl';
import { uniq } from 'lodash';
import { CatalogPricing } from '@ovh-ux/manager-models';

import { PRODUCT_ID } from './order.constants';

export default class NashaOrderController {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    coreConfig,
    BillingService,
    RedirectionService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.BillingService = BillingService;

    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');

    this.diskType = {
      value: null,
      displayed: false,
      list: [],
    };
    this.capacity = {
      value: null,
      displayed: false,
      plans: [],
    };
    this.datacenter = {
      value: null,
      displayed: false,
      list: [],
    };
    this.commitment = {
      value: null,
      displayed: false,
      price: null,
      pricings: [],
    };
    this.payment = {
      value: null,
      displayed: false,
      modes: [],
    };
  }

  $onInit() {
    this.plans.forEach((plan) => {
      const key = `nasha_order_capacity_description_${plan.planCode}`;
      const description = this.$translate.instant(key);
      Object.assign(plan.capacity, {
        description: (description !== key && description) || '',
      });
    });
  }

  get plan() {
    return this.capacity.value;
  }

  set plan(plan) {
    this.capacity.value = plan;
  }

  finish() {
    return this.$window.open(
      `${this.expressOrderUrl}${`?products=${JSURL.stringify([
        {
          productId: PRODUCT_ID,
          planCode: this.plan.planCode,
          pricingMode: this.payment.value.pricingMode,
          quantity: 1,
          duration: this.payment.value.pricing.duration,
          configuration: [
            { label: 'datacenter', values: [this.datacenter.value] },
          ],
        },
      ])}`}`,
      '_blank',
    );
  }

  focus(stepName) {
    const { diskType, capacity, datacenter, commitment, payment } = this;
    const steps = Object.entries({
      diskType,
      capacity,
      datacenter,
      commitment,
      payment,
    });
    const index = steps.findIndex(([name]) => name === stepName);

    steps.forEach(([, step], i) =>
      Object.assign(step, {
        ...(i >= index && { value: null }),
        displayed: i <= index,
      }),
    );

    this[`${stepName}Focus`]();
  }

  diskTypeFocus() {
    this.diskType.list = uniq(this.plans.map(({ diskType }) => diskType));
  }

  capacityFocus() {
    this.capacity.plans = this.plans
      .filter(({ diskType }) => diskType === this.diskType.value)
      .sort(({ capacity: { value: a } }, { capacity: { value: b } }) => a - b);
  }

  datacenterFocus() {
    this.datacenter.list = this.plan.datacenters;
  }

  commitmentFocus() {
    this.commitment.price = new CatalogPricing(this.plan.price).toPricing(
      this.user,
      this.userLocale,
    );
    this.commitment.pricings = this.plan.pricings
      .map((pricing) => new CatalogPricing(pricing))
      .filter((pricing) => pricing.includesRenew());
  }

  paymentFocus() {
    this.payment.modes = this.BillingService.getAvailableEngagementFromCatalog(
      this.commitment.pricings.filter(
        ({ commitment }) =>
          commitment === this.commitment.value.commitment.durationInMonths,
      ),
    );
  }
}
