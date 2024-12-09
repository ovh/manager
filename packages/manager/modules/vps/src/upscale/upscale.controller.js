import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

import { Price } from '@ovh-ux/manager-models';
import { pricingConstants } from '@ovh-ux/manager-product-offers';

import UpscaleService from './upscale.service';
import {
  PRICING_MODES,
  RANGES,
  LE_RANGES,
  UPSCALE_TRACKING_PREFIX,
} from './upscale.constants';

export default class UpscaleController {
  /* @ngInject */
  constructor($translate, atInternet, ovhManagerProductOffersService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.ovhManagerProductOffersService = ovhManagerProductOffersService;
  }

  $onInit() {
    this.errorMessage = null;
    this.resetRangeConfiguration();
    this.getCurrentRangeInformation();

    this.loading = {
      getUpscaleInformation: false,
      performUpscale: false,
    };

    this.currentVpsRange = UpscaleController.getSimpleRangeName(
      this.vps.model.name,
    );

    this.isEliteUpgrade = UpscaleController.isRangeElite(this.currentVpsRange);

    let upscaleRanges = UpscaleController.groupRanges(
      this.upscaleOptions,
      this.vps.model.name,
    );
    upscaleRanges = upscaleRanges.map((range) => this.formatRange(range));

    this.upscaleRanges = sortBy(upscaleRanges, 'indicativePricing.price');

    if (this.isEliteUpgrade) {
      this.range = this.upscaleRanges.find(({ formattedName }) =>
        UpscaleController.isRangeElite(formattedName),
      );
      this.goToNextStep(this.range.formattedName);
    }
  }

  resetRangeConfiguration() {
    this.planCode = null;
    this.rangeConfiguration = {
      bandwidth: null,
      cores: null,
      memory: null,
      storage: null,
    };
  }

  static convertFromCatalog(pricing) {
    return {
      ...pricing,
      pricingMode: pricing.mode,
      priceInUcents: pricing.price,
    };
  }

  getCurrentRangeInformation() {
    this.currentRangeConfiguration = UpscaleController.parseRangeConfiguration(
      this.vps.model.name,
    );

    const pricings = this.catalog.plans
      .find(({ planCode }) => planCode === this.vps.model.name)
      .pricings.map((pricing) => UpscaleController.convertFromCatalog(pricing));

    const currentRangePricing = this.getIndicativePricing(pricings);

    this.currentRangeConfiguration.pricing = {
      ...currentRangePricing,
      currency: this.connectedUser.currency.code,
      unit: Price.UNITS.MICROCENTS,
      value: currentRangePricing.priceInUcents,
    };
  }

  static getSimpleRangeName(rangeFullName) {
    const rangesKeys = Object.values(RANGES).join('|');
    const [simpleRangeName] = rangeFullName.match(
      new RegExp(rangesKeys, 'i'), // Range names have the following pattern: vps-xxxx-X-X-X, e.g.: vps-starter-1-8-20
    );
    return capitalize(simpleRangeName);
  }

  static isRangeElite(rangeName) {
    return rangeName === RANGES.ELITE;
  }

  static formatPrice(price, priceInUcents) {
    return {
      currency: price.currencyCode,
      unit: Price.UNITS.MICROCENTS,
      value: priceInUcents,
    };
  }

  formatRange(range) {
    const hasUpscaleConfigAvailable =
      ['cpu.cores', 'memory.size', 'storage.disks[0].capacity'].reduce(
        (acc, virtualHardware) =>
          acc ||
          this.getAvailableValuesForParameter(range.technicals, virtualHardware)
            .length > 1,
        false,
      ) || range.formattedName !== this.currentVpsRange;

    return {
      ...range,
      isCurrentRange: range.formattedName === this.currentVpsRange,
      hasUpscaleConfigAvailable,
      indicativePricing: this.getIndicativePricing(range.prices),
      formattedTechnical: {
        bandwidth: UpscaleController.getExtremumValueOfUnit(
          range.technicals,
          'bandwidth.level',
          maxBy,
        ),
        cpu: UpscaleController.getExtremumValueOfUnit(
          range.technicals,
          'cpu.cores',
          maxBy,
        ),
        memory: UpscaleController.getRangeOfUnit(
          range.technicals,
          'memory.size',
        ),
        storage: UpscaleController.getRangeOfUnit(
          range.technicals,
          'storage.disks[0].capacity',
        ),
      },
    };
  }

  goToNextStep(range) {
    this.currentIndex = UpscaleController.isRangeElite(range) ? 1 : 2;
  }

  getIndicativePricing(pricings) {
    const renewPricing = this.ovhManagerProductOffersService.constructor.getUniquePricingOfCapacity(
      pricings,
      pricingConstants.PRICING_CAPACITIES.RENEW,
    );

    const pricingMode = UpscaleService.convertPricingMode(
      renewPricing.pricingMode,
      this.pricingRenewPeriod,
    );

    const isUpfrontMode = pricingMode === PRICING_MODES.UPFRONT;

    return {
      ...renewPricing,
      price: UpscaleController.formatPrice(
        renewPricing.price,
        isUpfrontMode
          ? renewPricing.priceInUcents / renewPricing.interval
          : renewPricing.priceInUcents,
      ),
      pricingMode,
    };
  }

  static isRangeConfigurationComplete({ bandwidth, cores, memory, storage }) {
    return (
      bandwidth != null && cores != null && memory != null && storage != null
    );
  }

  isStorageSelectionDisabled(storage) {
    const { cores, memory } = this.rangeConfiguration;
    const rangeName = this.range.formattedName.toLowerCase();
    const plans = this.catalog.plans.map((plan) => plan.planCode);

    const vpsUpgradeRange = LE_RANGES.includes(rangeName)
      ? `vps-${rangeName}-${memory}-${storage}`
      : `vps-${rangeName}-${cores}-${memory}-${storage}`;

    return !plans.includes(vpsUpgradeRange) || storage < this.vps.model.disk;
  }

  getRangeConfigurationPricing() {
    if (
      UpscaleController.isRangeConfigurationComplete(this.rangeConfiguration)
    ) {
      this.planCode = UpscaleController.getPlanCodeFromSelectedRangeAndConfiguration(
        this.rangeConfiguration,
        this.range.formattedName.toLowerCase(),
      );

      this.isNewPlanCodeDifferent = this.planCode !== this.vps.model.name;

      try {
        if (this.isNewPlanCodeDifferent) {
          this.fetchUpscaleInformation();
        }
        const pricings = this.catalog.plans
          .find(({ planCode }) => planCode === this.planCode)
          .pricings.map((pricing) =>
            UpscaleController.convertFromCatalog(pricing),
          );

        const renewPricing = this.getIndicativePricing(pricings);

        this.rangeConfiguration.pricing = {
          ...renewPricing,
          currency: this.connectedUser.currency.code,
          pricingMode: UpscaleService.convertPricingMode(
            renewPricing.pricingMode,
            this.pricingRenewPeriod,
          ),
          unit: Price.UNITS.MICROCENTS,
          totalPrice: renewPricing.priceInUcents,
          value: renewPricing.price.value,
        };
        this.formatNewRangeInformation();
      } catch (error) {
        this.rangeConfiguration.pricing = null;
      }
    }
  }

  static getPlanCodeFromSelectedRangeAndConfiguration(
    configuration,
    rangeName,
  ) {
    const { cores, memory, storage } = configuration;
    if (LE_RANGES.includes(rangeName)) {
      return `vps-${rangeName}-${memory}-${storage}`;
    }
    return `vps-${rangeName}-${cores}-${memory}-${storage}`;
  }

  getPlanFromSelectedRangeAndConfiguration(configuration, rangeName) {
    const planCode = UpscaleController.getPlanCodeFromSelectedRangeAndConfiguration(
      configuration,
      rangeName,
    );
    return this.upscaleOptions.find((option) => option.planCode === planCode);
  }

  static groupRanges(ranges, currentPlanCode) {
    let groupedRanges = ranges
      .filter(({ planCode }) =>
        UpscaleController.filterPlanCodeByConfiguration(
          planCode,
          currentPlanCode,
        ),
      )
      .sort((rangeA, rangeB) =>
        UpscaleController.sortPlanCodesByConfiguration(
          rangeA.planCode,
          rangeB.planCode,
        ),
      );

    groupedRanges = UpscaleController.groupRangesByName(groupedRanges);
    return UpscaleController.reduceRangesGroup(groupedRanges);
  }

  static groupRangesByName(ranges) {
    return groupBy(ranges, ({ name }) =>
      UpscaleController.getSimpleRangeName(name),
    );
  }

  static reduceRangesGroup(groupedRanges) {
    return Object.entries(groupedRanges).map(([rangeName, rangeGroup]) => ({
      ...rangeGroup.reduce(
        (group, range) => ({
          ...group,
          technicals: group.technicals.concat(range.blobs.technical),
        }),
        {
          ...rangeGroup[0],
          technicals: [rangeGroup[0].blobs.technical],
        },
      ),
      formattedName: rangeName,
    }));
  }

  static getExtremumValueOfUnit(technicals, path, functionToApply) {
    const extremum = functionToApply(technicals, path);

    return parseInt(get(extremum, path), 10);
  }

  static getRangeOfUnit(technicals, path) {
    const min = UpscaleController.getExtremumValueOfUnit(
      technicals,
      path,
      minBy,
    );
    const max = UpscaleController.getExtremumValueOfUnit(
      technicals,
      path,
      maxBy,
    );

    return {
      min,
      max,
      minEqualMax: min === max,
    };
  }

  static filterPlanCodeByConfiguration(planCode, basePlanCode) {
    const [
      cores,
      memory,
      storage,
    ] = UpscaleController.extractConfigurationFromPlanCode(planCode);
    const [
      bCores,
      bMemory,
      bStorage,
    ] = UpscaleController.extractConfigurationFromPlanCode(basePlanCode);

    return cores >= bCores && memory >= bMemory && storage >= bStorage;
  }

  static sortPlanCodesByConfiguration(planCodeA, planCodeB) {
    const numericPlanCodeA = parseInt(
      UpscaleController.extractConfigurationFromPlanCode(planCodeA).join(''),
      10,
    );
    const numericPlanCodeB = parseInt(
      UpscaleController.extractConfigurationFromPlanCode(planCodeB).join(''),
      10,
    );

    if (numericPlanCodeA < numericPlanCodeB) {
      return -1;
    }

    if (numericPlanCodeA > numericPlanCodeB) {
      return 1;
    }

    return 0;
  }

  discardRangesWithLowerConfiguration(technicals, path) {
    return technicals.filter(
      (technical) =>
        !has(this.currentRangeConfiguration, path) ||
        get(technical, path) >= get(this.currentRangeConfiguration, path),
    );
  }

  static parseRangeConfiguration(rangeFullName) {
    const [
      cores,
      memory,
      storage,
    ] = UpscaleController.extractConfigurationFromPlanCode(rangeFullName);

    return {
      cpu: { cores },
      memory: { size: memory },
      storage: { disks: [{ capacity: storage }] },
    };
  }

  static extractConfigurationFromPlanCode(planCode) {
    const [cores, memory, storage] = planCode.match(/\d+/g);
    return [parseInt(cores, 10), parseInt(memory, 10), parseInt(storage, 10)];
  }

  initRangeConfiguration(values, path) {
    [this.rangeConfiguration[path]] = values;

    this.getRangeConfigurationPricing();
  }

  getAvailableValuesForParameter(technicals, path) {
    if (!technicals) {
      return [];
    }

    return sortBy(
      uniqBy(
        this.discardRangesWithLowerConfiguration(
          technicals,
          path,
        ).map((technical) => get(technical, path)),
      ),
      (value) => value,
    );
  }

  handleError(error, isEliteUpgrade, messages) {
    if (error?.status === 400 && this.vps.state === 'rescued') {
      this.errorMessage = `${this.$translate.instant(
        'vps_upscale_fail_vps_in_rescue_info',
      )} <a href="${this.getRebootLink()}">${this.$translate.instant(
        'vps_upscale_fail_vps_in_rescue_action',
      )}</a>`;
    } else {
      const errorMessage = isEliteUpgrade
        ? this.$translate.instant(messages.eliteUpgrade)
        : this.$translate.instant(messages.normalUpgrade);

      this.errorMessage = `${errorMessage} ${get(error, 'data.message')}`;
    }
    this.scrollToTop();
  }

  fetchUpscaleInformation() {
    this.loading.getUpscaleInformation = true;
    const plan = this.getPlanFromSelectedRangeAndConfiguration(
      this.rangeConfiguration,
      this.range.formattedName.toLowerCase(),
    );
    const currentPlanCode = this.upscaleRanges.find((e) => e.isCurrentRange)
      ?.planCode;
    return this.getUpscaleInformation(plan)
      .then(({ order }) => {
        this.order = order;
        this.order.prices.withoutTax.unit = Price.UNITS.CENTS;
        this.order.prices.withoutTax.text = UpscaleService.buildPriceToDisplay(
          {
            currency: this.connectedUser.currency.code,
            value: order.prices.withoutTax.value,
          },
          this.connectedUser.language,
        );
      })
      .catch((error) => {
        this.atInternet.trackPage({
          name: `vps::upscale-confirm-banner::error::${currentPlanCode}_to_${plan.planCode}`,
          type: 'navigation',
        });
        this.handleError(
          error,
          UpscaleController.isRangeElite(this.range.formattedName),
          {
            eliteUpgrade: 'vps_upscale_get_configuration_information_error',
            normalUpgrade: 'vps_upscale_get_information_error',
          },
        );
      })
      .finally(() => {
        this.loading.getUpscaleInformation = false;
      });
  }

  formatNewRangeInformation() {
    this.newRangeInformation = null;
    let newRangeInformation;
    if (
      !UpscaleController.isRangeConfigurationComplete(this.rangeConfiguration)
    ) {
      newRangeInformation = UpscaleController.parseRangeConfiguration(
        this.range.planCode,
      );

      newRangeInformation.pricing = {
        ...this.range.indicativePricing,
        currency: this.order.prices.withoutTax.currencyCode,
        paymentType: UpscaleService.convertPricingMode(
          this.range.indicativePricing.pricingMode,
          this.pricingRenewPeriod,
        ),
        unit: Price.UNITS.MICROCENTS,
        value: this.range.indicativePricing.priceInUcents,
      };
    } else {
      newRangeInformation = {
        cpu: { cores: this.rangeConfiguration.cores },
        memory: { size: this.rangeConfiguration.memory },
        pricing: {
          ...this.rangeConfiguration.pricing,
          paymentType: this.rangeConfiguration.pricing.pricingMode,
          value: this.rangeConfiguration.pricing.totalPrice,
        },
        storage: { disks: [{ capacity: this.rangeConfiguration.storage }] },
      };
    }

    this.newRangeInformation = newRangeInformation;
  }

  getValidationInformation() {
    const { paymentType } = this.newRangeInformation.pricing;

    return `vps_upscale_summary_price_${paymentType}_${
      this.defaultPaymentMethod ? 'with' : 'without'
    }_payment_method_validation`;
  }

  performUpscaleService() {
    this.loading.performUpscale = true;
    const plan = this.getPlanFromSelectedRangeAndConfiguration(
      this.rangeConfiguration,
      this.range.formattedName.toLowerCase(),
    );
    const currentPlanCode = this.upscaleRanges.find((e) => e.isCurrentRange)
      ?.planCode;
    return this.performUpscale(plan)
      .then((upscaleOrder) => {
        const baseKey = this.isEliteUpgrade
          ? 'vps_upscale_elite_upgrade_success'
          : 'vps_upscale_success';
        let key = `${baseKey}_without_payment_method`;
        const { paymentType } = this.newRangeInformation.pricing;
        if (this.defaultPaymentMethod) {
          key = `${baseKey}_${paymentType}_with_payment_method`;
        }
        this.atInternet.trackPage({
          name: `vps::upscale-confirm-banner::success::${currentPlanCode}_to_${plan.planCode}`,
          type: 'navigation',
        });
        return this.goBack(
          this.$translate.instant(key, {
            billUrl: upscaleOrder.order.url,
            price: upscaleOrder.order.prices.withoutTax.text,
          }),
        );
      })
      .catch((error) => {
        this.atInternet.trackPage({
          name: `vps::upscale-confirm-banner::error::${currentPlanCode}_to_${plan.planCode}`,
          type: 'navigation',
        });
        this.handleError(error, this.isEliteUpgrade, {
          eliteUpgrade: 'vps_upscale_elite_upgrade_error',
          normalUpgrade: 'vps_upscale_error',
        });
      })
      .finally(() => {
        this.loading.performUpscale = false;
      });
  }

  trackStep(index, order) {
    const currentPlanCode = this.upscaleRanges.find((e) => e.isCurrentRange)
      ?.planCode;
    const { planCode } = this.getPlanFromSelectedRangeAndConfiguration(
      this.rangeConfiguration,
      this.range.formattedName.toLowerCase(),
    );
    return order
      ? this.atInternet.trackClick({
          name: `${UPSCALE_TRACKING_PREFIX}${index}::order-${currentPlanCode}_to_${planCode}`,
          type: 'action',
        })
      : this.atInternet.trackPage({
          name: `${UPSCALE_TRACKING_PREFIX}${index}`,
          type: 'navigation',
        });
  }
}
