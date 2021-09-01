import { isNull } from 'lodash-es';

import { AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM } from '../enums/payment-method.enum';
import { PaymentMethodType } from './payment-method-type.class';

/**
 *  Describe an available payment method object.
 */
export class AvailablePaymentMethod {
  /**
   *  Create a AvailablePaymentMethod.
   *
   *  @param {Object} options Options for creating a new AvailablePaymentMethod object.
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
     *  Merchant id to use in case of component integration type.
     *  @type {String}
     */
    this.merchantId = options.merchantId;

    /**
     *  Flag indicating if we can use the payment method type for oneshot payment.
     *  @type {Boolean}
     */
    this.oneshot = options.oneshot;

    /**
     *  The type of the payment method.
     *  @type {PaymentMethodType}
     */
    this.type = new PaymentMethodType(options.paymentType);

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
    return [AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.IFRAME_VANTIV].includes(
      this.integration,
    );
  }

  /**
   *  Determine if payment method type requires finalization.
   *  This method uses the integration attribute to determine it.
   *  @return {Boolean} true if type requires finalization false otherwise.
   */
  isRequiringFinalization() {
    return [
      AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.IFRAME_VANTIV,
      AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.IN_CONTEXT,
    ].includes(this.integration);
  }

  /**
   *  Determine if payment method type requires component to handle the register.
   *  The component may have its own submit logic.
   *  This method uses the integration attribute to determine it.
   *  @return {Boolean} true if type requires inputs false otherwise.
   */
  isHandleByComponent() {
    return [AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.COMPONENT].includes(
      this.integration,
    );
  }
}

export default {
  AvailablePaymentMethod,
};
