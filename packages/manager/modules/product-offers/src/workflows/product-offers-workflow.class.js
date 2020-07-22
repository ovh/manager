import isEqual from 'lodash/isEqual';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

import Pricing from '../pricing/pricing.class';
import ProductOffersService from '../services/product-offers.service';

import { CHECKOUT_DETAILS_TYPE } from './product-offers-workflow.constants';
import { PRICING_CAPACITIES } from '../pricing/pricing.constants';

/**
 * Workflow base class
 * Each type of workflow (see WORKFLOW_TYPES), inherits this abstract class
 * @abstract
 */
export default class Workflow {
  /**
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Workflow specific options. Each type of
   * workflow has its own options to work with.
   * See other workflow class constructor documentation for more details.
   */
  constructor($q, $translate, workflowOptions) {
    this.$q = $q;
    this.$translate = $translate;

    if (new.target === Workflow) {
      throw new TypeError(
        'ovhProductOffers-Workflow: Workflow cannot be instanciated directly',
      );
    }

    if (!workflowOptions) {
      throw new Error(
        'ovhProductOffers-Workflow: workflowOptions is undefined',
      );
    }

    Object.assign(this, workflowOptions);

    this.currentIndex = 0;

    this.loading = {
      getPricingInformation: false,
      getOfferValidationInformation: false,
      validateOffer: false,
    };
  }

  /**
   * Determines if the selected pricing is free
   * @return {boolean}
   */
  isFreePricing() {
    return (
      this.pricing &&
      this.pricing.isFree() &&
      (this.pricing.hasExtraPricing()
        ? this.pricing.extraPricing.isFree()
        : true)
    );
  }

  /**
   * Determines if the offer has a unique pricing to use
   * @return {boolean}
   */
  hasUniquePricing() {
    return this.pricings && this.pricings.length === 1;
  }

  /**
   * Return an object which determines the workflow loading state
   * @return {Object} Object representing thr state
   */
  getCurrentState() {
    return {
      isLoading: this.isLoading(),
    };
  }

  /**
   * Update the loading status, based on a action loading name, and call the
   * method to update upper scope
   * @param  {string} loadingKey Action loading name
   */
  updateLoadingStatus(loadingKey) {
    this.loading[loadingKey] = !this.loading[loadingKey];
    this.sendCurrentState({ state: this.getCurrentState() });
  }

  /**
   * Determines if the workflow is currently loading
   * @return {boolean}
   */
  isLoading() {
    return some(Object.values(this.loading), (value) => value);
  }

  /**
   * Compute pricings, based on the pricing type.
   * @param  {Array} pricingsToCompute Pricings of the option to order.
   * @return {Array<Pricing>}          List of computed pricings,
   * sorted by price.
   */
  computePricing(pricingsToCompute) {
    let pricings;

    switch (this.pricingType) {
      case PRICING_CAPACITIES.DETACH:
        pricings = Workflow.getDetachPricings(pricingsToCompute);
        break;
      case PRICING_CAPACITIES.RENEW:
        pricings = Workflow.getRenewPricings(pricingsToCompute);
        break;
      default:
        pricings = ProductOffersService.filterPricingsByCapacity(
          pricingsToCompute,
          this.pricingType,
        ).map((pricing) => Workflow.convertPricingObject(pricing));
    }

    return sortBy(pricings, 'price');
  }

  /**
   * Get detach pricings, by mapping all its associated renew pricings
   * to the detach pricing
   * @param  {Array} providedPricings Pricings to get detach ones
   * @return {Array}                  Detach pricings
   */
  static getDetachPricings(providedPricings) {
    const detachPricing = ProductOffersService.getUniquePricingOfCapacity(
      providedPricings,
      PRICING_CAPACITIES.DETACH,
    );

    const renewPricings = ProductOffersService.filterPricingsByCapacity(
      providedPricings,
      PRICING_CAPACITIES.RENEW,
    );

    return renewPricings
      .map((renewPricing) => ({
        ...detachPricing,
        description: `${detachPricing.description} (${renewPricing.description})`,
        duration: renewPricing.duration,
        interval: renewPricing.interval,
        extraPricing: Workflow.convertPricingObject(renewPricing),
        extraPricingCapacity: PRICING_CAPACITIES.RENEW,
      }))
      .map((pricing) => Workflow.convertPricingObject(pricing));
  }

  /**
   * Get the renew pricings, with its installation pricing if it exists
   * @param  {Array} providedPricings Pricings to get renew ones
   * @return {Array}                  Renew pricings
   */
  static getRenewPricings(providedPricings) {
    const installationPricing = ProductOffersService.getUniqueInstallationPricing(
      providedPricings,
    );

    const renewPricings = ProductOffersService.filterPricingsByCapacity(
      providedPricings,
      PRICING_CAPACITIES.RENEW,
    );

    const pricingsWithOnlyRenewCapacity = renewPricings.filter(
      ({ capacities }) => isEqual(capacities, [PRICING_CAPACITIES.RENEW]),
    );

    const pricingsWitRenewAndInstallationCapacities = renewPricings.filter(
      ({ capacities }) =>
        isEqual(capacities.sort(), [
          PRICING_CAPACITIES.INSTALLATION,
          PRICING_CAPACITIES.RENEW,
        ]),
    );

    if (
      !installationPricing &&
      !pricingsWitRenewAndInstallationCapacities &&
      pricingsWithOnlyRenewCapacity
    ) {
      throw new Error(
        'ovhProductOffers-OrderWorkflow: No installation pricing found',
      );
    }

    return pricingsWithOnlyRenewCapacity
      .map((pricing) => ({
        ...pricing,
        extraPricing: Workflow.convertPricingObject(installationPricing),
        extraPricingCapacity: installationPricing.capacities[0],
      }))
      .concat(pricingsWitRenewAndInstallationCapacities)
      .map((pricing) => Workflow.convertPricingObject(pricing));
  }

  /**
   * Convert pricing object to new Pricing class instance
   * @param  {Object} pricing Pricing to transform
   * @return {Pricing}        Instance of Pricing
   */
  static convertPricingObject(pricing) {
    return new Pricing(pricing);
  }

  static getDurationDetails(details) {
    return details.find(
      ({ detailType }) => detailType === CHECKOUT_DETAILS_TYPE.DURATION,
    );
  }

  static formatDateToLocale(date, locale, formatOptions) {
    const bcp47language = convertLanguageFromOVHToBCP47(locale);
    return new Intl.DateTimeFormat(bcp47language, formatOptions).format(date);
  }

  static getProrataTemporisDateFromDescription(detail) {
    const descriptionDateMatch = detail.description.match(
      /\d{2,4}([/.-])\d{2}\1\d{2,4}/g,
    );

    return descriptionDateMatch ? descriptionDateMatch[0] : null;
  }

  static getDurationProrataDate(details) {
    const durationDetails = Workflow.getDurationDetails(details);

    if (durationDetails) {
      const date = Workflow.getProrataTemporisDateFromDescription(
        durationDetails,
      );

      return date;
    }

    return null;
  }
}
