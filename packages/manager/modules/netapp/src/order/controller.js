import JSURL from 'jsurl';
import { minBy, maxBy, uniq } from 'lodash-es';
import { CatalogPricing } from '@ovh-ux/manager-models';

import { SIZE_FACTOR, SIZE_MULTIPLE, REGION_LABEL } from './constants';

const findRegionConfiguration = (configurations) =>
  configurations.find(({ name }) => name === 'region')?.values;

const getPlansWithRegion = (plans, region) =>
  plans.filter(({ configurations }) =>
    findRegionConfiguration(configurations).includes(region),
  );

const getPlansWithLicense = (plans, license) =>
  plans.filter(({ blobs }) => blobs?.commercial?.brick === license);

const getDefaultPrice = (plan) =>
  plan.pricings.find(({ mode }) => mode === 'default');

const getPrice = (plan) =>
  plan.pricings.find(
    ({ capacities, mode }) =>
      capacities.includes('renew') && mode === 'default',
  );

export default class OvhManagerNetAppOrderCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    BillingService,
    coreConfig,
    RedirectionService,
  ) {
    this.$translate = $translate;
    this.BillingService = BillingService;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.plans = [];
    this.selectedLicense = null;
    this.duration = 1;
  }

  onLicenceStepFocus() {
    const licenses = uniq(
      this.catalog.plans
        .flatMap(({ blobs }) => blobs?.commercial?.brick)
        .filter((value) => !!value),
    );

    this.licenses = licenses.map((license) => {
      const plans = getPlansWithLicense(this.catalog.plans, license);
      const price = minBy(
        plans.map((plan) => getPrice(plan)),
        'price',
      );
      return {
        name: license,
        price,
      };
    });
  }

  onRegionStepFocus() {
    const plans = getPlansWithLicense(
      this.catalog.plans,
      this.selectedLicense.name,
    );
    this.regions = uniq(
      plans.flatMap(
        ({ configurations }) =>
          configurations.find(({ name }) => name === 'region').values,
      ),
    );
  }

  onSizeStepFocus() {
    const plans = getPlansWithLicense(
      this.catalog.plans,
      this.selectedLicense.name,
    );
    const availablePlans = getPlansWithRegion(plans, this.selectedRegion);
    this.plans = availablePlans.map((plan) => ({
      ...plan,
      size:
        this.catalog.products.find(({ name }) => name === plan.product)?.blobs
          ?.technical?.storage.disks[0].capacity / SIZE_FACTOR,
      defaultPrice: getDefaultPrice(plan),
    }));

    this.plan = minBy(this.plans, 'size');

    this.minSize = this.plan.size;
    this.maxSize = maxBy(this.plans, 'size').size;
    this.selectedSize = this.minSize;
    this.selectedSizeRange = this.minSize;

    this.highlightedPlans = this.plans.filter(
      ({ size }) =>
        size === this.minSize ||
        (size % SIZE_MULTIPLE === 0 && (size / SIZE_MULTIPLE) % 2 === 0),
    );
  }

  onCustomSizeChange(modelValue) {
    this.plan = this.plans.find(({ size }) => size === modelValue);
  }

  onCommitmentStepFocus() {
    this.defaultPrice = new CatalogPricing(
      this.selectedLicense.price,
    ).toPricing(this.coreConfig.getUser(), this.coreConfig.getUserLocale());
    this.pricings = this.plan.pricings
      .map((pricing) => new CatalogPricing(pricing))
      .filter((pricing) => pricing.includesRenew());
  }

  onPricingModeStepFocus() {
    this.pricingModes = this.BillingService.getAvailableEngagementFromCatalog(
      this.pricings.filter(
        ({ commitment }) =>
          commitment === this.duration.commitment.durationInMonths,
      ),
    );
  }

  goToOrderUrl() {
    const order = {
      planCode: this.plan.planCode,
      productId: 'netapp',
      pricingMode: this.pricingMode.pricingMode,
      quantity: 1,
      configuration: [
        {
          label: REGION_LABEL,
          value: this.selectedRegion,
        },
      ],
    };
    return this.$window.open(
      `${this.RedirectionService.getURL(
        'expressOrder',
      )}?products=${JSURL.stringify([order])}`,
      '_blank',
    );
  }
}
