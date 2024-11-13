import JSURL from 'jsurl';
import { maxBy, minBy, uniq } from 'lodash-es';
import { CatalogPricing } from '@ovh-ux/manager-models';

import {
  REGION_LABEL,
  SIZE_FACTOR,
  SIZE_MULTIPLE,
  IN_COMPATIBLE_REGION,
  DATACENTER_TO_COUNTRY,
  DATACENTER_TO_REGION,
} from './constants';

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
    atInternet,
    BillingService,
    coreConfig,
    RedirectionService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.RedirectionService = RedirectionService;
    this.IN_COMPATIBLE_REGION = IN_COMPATIBLE_REGION;
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
    [this.selectedLicense] = this.licenses;
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

    this.catalogByLocation = this.regions.map((datacenter) => {
      const flag =
        datacenter === 'ERI' ? 'gb' : DATACENTER_TO_COUNTRY[datacenter];
      return {
        datacenter,
        regionName: DATACENTER_TO_REGION[datacenter],
        location: this.$translate.instant(
          `netapp_order_location_${DATACENTER_TO_REGION[datacenter]}`,
        ),
        icon: `oui-flag oui-flag_${flag}`,
      };
    });

    [this.selectedRegion] = this.catalogByLocation;
  }

  onSizeStepFocus() {
    const plans = getPlansWithLicense(
      this.catalog.plans,
      this.selectedLicense.name,
    );
    const availablePlans = getPlansWithRegion(
      plans,
      this.selectedRegion.datacenter,
    );
    this.plans = availablePlans.map((plan) => ({
      ...plan,
      size:
        this.catalog.products.find(({ name }) => name === plan.product)?.blobs
          ?.technical?.storage.disks[0].capacity / SIZE_FACTOR,
      defaultPrice: getDefaultPrice(plan),
    }));

    const lowestPlanSize = minBy(this.plans, 'size');
    this.plan = this.plan || lowestPlanSize;

    this.minSize = lowestPlanSize.size;
    this.maxSize = maxBy(this.plans, 'size').size;
    this.selectedSize = this.plan?.size || this.minSize;
    this.selectedSizeRange = this.plan?.size || this.minSize;

    this.highlightedPlans = this.plans.filter(
      ({ size }) =>
        size === this.minSize ||
        (size % SIZE_MULTIPLE === 0 && (size / SIZE_MULTIPLE) % 2 === 0),
    );
  }

  onPlanChange(modelValue) {
    this.isPlanChanged = true;
    this.selectedSize = modelValue.size;
  }

  onCustomSizeChange(modelValue) {
    this.isPlanChanged = true;
    this.plan = this.plans.find(({ size }) => size === modelValue);
  }

  onCommitmentStepFocus() {
    this.isPlanChanged = false;
    this.defaultPrice = new CatalogPricing(
      this.selectedLicense.price,
    ).toPricing(this.coreConfig.getUser(), this.coreConfig.getUserLocale());
    this.pricings = this.plan.pricings
      .map((pricing) => new CatalogPricing(pricing))
      .filter((pricing) => pricing.includesRenew());
  }

  onPricingModeStepFocus() {
    this.isCommitmentChange = false;
    this.pricingModes = this.BillingService.getAvailableEngagementFromCatalog(
      this.pricings.filter(
        ({ commitment }) =>
          commitment === this.duration.commitment.durationInMonths,
      ),
    );
    [this.pricingMode] = this.pricingModes;
  }

  goToOrderUrl() {
    const pricingModeType = this.pricingMode.pricingMode.replace(/[0-9]+/, '');
    this.atInternet.trackClick({
      name: `netapp::order::confirm::${this.selectedRegion.datacenter}_${this.selectedLicense.name}_${this.selectedSize}TB_${this.duration.duration}_${pricingModeType}`,
      type: 'action',
    });

    const { pricingMode, pricing } = this.pricingMode;
    const isMonthlyCommitmentPayment =
      pricing.duration !== 'P1M' && pricing.interval !== 1;

    const order = {
      planCode: this.plan.planCode,
      productId: 'netapp',
      pricingMode,
      quantity: 1,
      ...(isMonthlyCommitmentPayment && { duration: pricing.duration }),
      configuration: [
        {
          label: REGION_LABEL,
          value: this.selectedRegion.datacenter,
        },
      ],
    };
    const expressOrderUrl = this.RedirectionService.getURL('expressOrder');
    const queryParams = `?products=${JSURL.stringify([order])}`;

    this.goBack();
    return this.$window.open(`${expressOrderUrl}${queryParams}`, '_blank');
  }
}
