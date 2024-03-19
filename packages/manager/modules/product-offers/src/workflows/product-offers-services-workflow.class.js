import get from 'lodash/get';
/* eslint-disable import/extensions */
import Workflow from './product-offers-workflow.class';

/**
 * Workflow Class to handle service detachable or upgradable options
 */
export default class ServicesWorkflow extends Workflow {
  /**
   * @param {Object} $q              AngularJS provider
   * @param {Object} $timeout        AngularJS provider
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Specific options
   * for this workflow, must contains the following values:
   * - {optionId} (Optional): Option id to display information about termination date if needed
   * - {serviceId}: Id of the service on which to detach or upgrade an option
   * - {plancodes}: Detach or upgrade plancodes to use
   * - {durationToUse}: Duration to use, will override the default pricing
   * duration.
   * @param {Object} workflowService   Service to handle request to perform an
   * action (detach, upgrade), see /services API schema
   */
  constructor($q, $timeout, $translate, workflowOptions, workflowService) {
    super($q, $timeout, $translate, workflowOptions);
    this.workflowService = workflowService;

    if (!this.serviceId) {
      throw new Error(
        'ovhProductOffers - ServicesWorkflow: serviceId is undefined',
      );
    }
  }

  /**
   * Get the pricings from available detach or upgrade plan codes,
   * based on the pricing type
   */
  getPricings() {
    let selectedPlanCode;
    if (typeof this.getPlanCode === 'function') {
      selectedPlanCode = this.plancodes.find(
        ({ planCode }) => planCode === this.getPlanCode(),
      );
    }
    const actionPlancode = selectedPlanCode || this.plancodes[0];
    this.plancode = actionPlancode.planCode;
    this.pricings = this.computePricing(actionPlancode.prices);

    if (this.hasUniquePricing() && !this.expressOrder) {
      this.$timeout(() => {
        this.currentIndex += 1;
        [this.pricing] = this.pricings;
        if (typeof this.onPricingSubmit === 'function') {
          this.onPricingSubmit(this.pricing);
        }
      });
    }
  }

  /**
   * Get the information for validation
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise}
   */
  getValidationInformation() {
    this.updateLoadingStatus('getOfferValidationInformation');

    const pricing = this.pricing || this.pricings[0];
    this.validationParameters = {
      duration: this.durationToUse || pricing.getDurationISOFormat(),
      pricingMode: pricing.mode,
      quantity: pricing.minimumQuantity,
    };

    return this.workflowService
      .simulate(
        this.plancode,
        this.serviceId,
        this.pricingType,
        this.validationParameters,
      )
      .then(({ order }) => {
        this.contracts = order.contracts;
        this.prices = order.prices;
        this.prorataDurationDate = this.constructor.getDurationProrataDate(
          order.details,
        );
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.updateLoadingStatus('getOfferValidationInformation');
      });
  }

  /**
   * Determines if termination details must be displayed, if pricing has extra fees
   * @param {Object} pricing - Pricing
   * @return {boolean}
   */
  static hasTerminationDetails(pricing) {
    return pricing.hasExtraPricing() && !pricing.extraPricing.isFree();
  }

  /**
   * Returns the termination date formatted to locale
   * @param {Object} pricing - Pricing
   * @param {string} locale  - Locale to use
   * @return {boolean}
   */
  static getTerminationDate(pricing, locale) {
    const date = new Date();
    date.setMonth(date.getMonth() + pricing.interval);

    return Workflow.formatDateToLocale(date, locale, {
      year: 'numeric',
      month: 'numeric',
    });
  }

  /**
   * Validate the offer
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise} Promise of the validated offer
   */
  validateOffer() {
    this.updateLoadingStatus('validateOffer');

    const autoPayWithPreferredPaymentMethod =
      !!this.defaultPaymentMethod || this.isFreePricing();

    let result;

    this.validationParameters.autoPayWithPreferredPaymentMethod = autoPayWithPreferredPaymentMethod;

    return this.workflowService
      .execute(
        this.plancode,
        this.serviceId,
        this.pricingType,
        this.validationParameters,
      )
      .then(({ order }) => {
        result = order;

        return autoPayWithPreferredPaymentMethod
          ? this.workflowService.pay(result, this.defaultPaymentMethod)
          : this.$q.when();
      })
      .then(() => {
        const validateResult = {
          ...result,
          autoPayWithPreferredPaymentMethod,
        };

        if (autoPayWithPreferredPaymentMethod) {
          validateResult.paymentMethodLabel = get(
            this.defaultPaymentMethod,
            'label',
          );
        }

        this.onSuccess({
          result: validateResult,
        });
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.updateLoadingStatus('validateOffer');
      });
  }
}
