import controller from './product-offers.controller';
import template from './product-offers.html';

/**
 *  Product offers component. Can use several workflows. See details of each
 *  workflow in the concerned folder.
 *
 *  The component is based on ovh-ui-kit 'oui-stepper'
 *  It is aimed to handle the following order steps:
 *  - Pricing choice
 *  - Payment
 *
 *  This can be used in combination with one or many configuration steps,
 *  if more details are required to setup plan code and/or configuration item
 *  list.
 *  The configuration step must be set as following:
 *  <ovh-product-offers
 *      workflowType="'order'"
 *      workflowOptions="$ctrl.workflowOptions"
 *      send-current-state="$ctrl.getOrderState(state)"
 *      pricing-type="'renew'"
 *      user="$ctrl.user"
 *      on-success="$ctrl.displaySuccessMessage()"
 *      on-error="$ctrl.handleError()"
 *  >
 *    // Configuration step
 *    <oui-step-form>
 *      <oui-field>
 *        Some input
 *      </oui-field>
 *    </oui-step-form>
 *    // End of configuration step
 *  </ovh-product-offers>
 */
export default {
  bindings: {
    /**
     * Type of pricing. See PRICING_CAPACITIES.
     * @type {string}
     */
    pricingType: '<',

    /**
     * Method to send component current state, so the upper scope is aware of
     * the loading state of the component.
     * Example :
     * In controller :
     * getOrderState(state) { this.orderState = state; }
     * then:
     * if (this.orderState.isLoading) { // Some code }
     * @type {Function}
     */
    sendCurrentState: '&',

    /**
     * User informations, for cart creation, price format style.
     * @type {string}
     */
    user: '<',

    /**
     * Type of workflow to use. See WORKFLOW_TYPES in constants.
     * @type {string}
     */
    workflowType: '<',

    /**
     * List of options need by the used workflow.
     * @type {Object}
     */
    workflowOptions: '<',

    /**
     * Error handler.
     * @type {Function}
     * @returns {boolean} false if the error has not been handled and should be escalated
     */
    onError: '&',

    /**
     * Success handler.
     * @type {Function}
     */
    onSuccess: '&',
  },
  controller,
  template,
  transclude: 'true',
};
