import { isNull } from 'lodash-es';

import { TYPE_INTEGRATION_ENUM } from './payment-method.constants';
import OvhPaymentMethodType from './payment-method-type.class';

/**
 *  Describe an available payment method object.
 */
export default class OvhAvailablePaymentMethod {
  /**
   *  Create a OvhAvailablePaymentMethod.
   *
   *  @param {Object} options Options for creating a new OvhAvailablePaymentMethod object.
   *  @param {Object} options.icon Informations about the payment method type icon.
   *  @param {String} options.icon.name Name of the icon.
   *  @param {String} options.icon.data Icon in base64.
   *  @param {String} options.integration Type of integration of the payment type.
   *  @param {Boolean} options.oneshot Flag indicating if we can use the payment method type
   *                                   for oneshot payment.
   *  @param {String} options.paymentType The name of the payment method type.
   *  @param {Boolean} options.registerable Flag indicating if we can register the payment type.
   *  @param {Boolean} options.registerableWithTransaction Flag indicating if we can register the
   *                                                       payment type and in the same time
   *                                                       pay an order.
   *  @param {Object} [options.original] An OvhPaymentMeanType object instance if legacy.
   */
  constructor(options) {
    /**
     *  Informations about the payment method type icon.
     *  This object is represented by the icon name and the icon data.
     *  @type {Object}
     */
    this.icon = options.icon;

    /**
     *  Type of integration of the payment type.
     *  @type {String}
     */
    this.integration = options.integration;

    /**
     *  Flag indicating if we can use the payment method type for oneshot payment.
     *  @type {Boolean}
     */
    this.oneshot = options.oneshot;

    /**
     *  The type of the payment method.
     *  @type {OvhPaymentMethodType}
     */
    this.type = new OvhPaymentMethodType(options.paymentType);

    /**
     *  Flag indicating if we can register the payment type.
     *  @type {Boolean}
     */
    this.registerable = options.registerable;

    /**
     *  Flag indicating if we can register the payment type and in the same time pay an order.
     *  @type {Boolean}
     */
    this.registerableWithTransaction = options.registerableWithTransaction;

    /**
     *  An OvhPaymentMeanType object instance representing a legacy payment mean type.
     *  @type {Object}
     */
    this.original = options.original || null;
  }

  /**
   * Get the name of the payment type. For retro-compatibility.
   * @return {String} The name of the payment type.
   */
  get paymentType() {
    return this.type.paymentType;
  }

  /**
   *  Determine if payment method type is a legacy one (if original attribute is setted).
   *  @return {Boolean} true if payment method type is legacy, false otherwise.
   */
  isLegacy() {
    return !isNull(this.original);
  }

  /**
   *  Determine if payment method type require a billing contact id when creating it.
   *  This method uses the integration attribute to determine it.
   *  @return {Boolean} true if type requires a billing contact id false otherwise.
   */
  isRequiringContactId() {
    return [TYPE_INTEGRATION_ENUM.IFRAME_VANTIV].includes(this.integration);
  }

  /**
   *  Determine if payment method type requires finalization.
   *  This method uses the integration attribute to determine it.
   *  @return {Boolean} true if type requires finalization false otherwise.
   */
  isRequiringFinalization() {
    return [
      TYPE_INTEGRATION_ENUM.IFRAME_VANTIV,
      TYPE_INTEGRATION_ENUM.IN_CONTEXT,
    ].includes(this.integration);
  }
}
