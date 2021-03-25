import get from 'lodash/get';
/* eslint-disable import/extensions */
import Workflow from './product-offers-workflow.class';

/**
 * Workflow Class to handle service detachable options
 */
export default class ServicesWorkflow extends Workflow {
  /**
   * @param {Object} $q              AngularJS provider
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Specific options
   * for this workflow, must contains the following values:
   * - {optionId} (Optional): Option id to display information about termination date if needed
   * - {serviceId}: Id of the service on which to detach an option
   * - {detachPlancodes}: Item representing the option to detach
   * - {durationToUse}: Duration to use, will override the default pricing
   * duration.
   * @param {Object} DetachService   Service to handle request to perform a
   * detach action, see /services API schema
   */
  constructor($q, $timeout, $translate, workflowOptions, detachService) {
    super($q, $translate, workflowOptions);
    this.$timeout = $timeout;
    this.workflowService = detachService;

    if (!this.serviceId) {
      throw new Error(
        'ovhProductOffers - ServicesWorkflow: serviceId is undefined',
      );
    }
  }

  /**
   * Get the pricings from available detach plan codes,
   * based on the pricing type
   */
  getPricings() {
    const [detachPlancode] = this.detachPlancodes; // Yes, for the moment, there is just one plan code
    this.plancode = detachPlancode.planCode;
    this.pricings = this.computePricing(detachPlancode.prices);

    if (this.hasUniquePricing()) {
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
   * Get the information for detach validation
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise}
   */
  getValidationInformation() {
    this.updateLoadingStatus('getOfferValidationInformation');

    const pricing = this.pricing || this.pricings[0];
    this.validationParameters = {
      duration: this.durationToUse || pricing.getDurationISOFormat(),
      pricingMode: pricing.mode,
      quantity: 1,
    };

    return this.workflowService
      .simulateDetach(this.plancode, this.serviceId, this.validationParameters)
      .then(({ order }) => {
        this.contracts = order.contracts;
        this.prices = order.prices;
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
   * Validate the detach offer
   * Will tell to upper scope the loading state of the workflow
   * @return {Promise} Promise of the validated detach offer
   */
  validateOffer() {
    this.updateLoadingStatus('validateOffer');

    const autoPayWithPreferredPaymentMethod =
      !!this.defaultPaymentMethod || this.isFreePricing();

    let detachResult;

    this.validationParameters.autoPayWithPreferredPaymentMethod = autoPayWithPreferredPaymentMethod;

    return this.workflowService
      .executeDetach(this.plancode, this.serviceId, this.validationParameters)
      .then(({ order: orderResult }) => {
        detachResult = orderResult;

        return autoPayWithPreferredPaymentMethod
          ? this.workflowService.payDetach(
              detachResult,
              this.defaultPaymentMethod,
            )
          : this.$q.when();
      })
      .then(() => {
        const validatedDetach = {
          ...detachResult,
          autoPayWithPreferredPaymentMethod,
        };

        if (autoPayWithPreferredPaymentMethod) {
          validatedDetach.paymentMethodLabel = get(
            this.defaultPaymentMethod,
            'label',
          );
        }

        this.onSuccess({
          detachResult: validatedDetach,
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
