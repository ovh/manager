import { isNull } from 'lodash-es';

import { PaymentMethodType } from './payment-method-type.class';
import { PAYMENT_METHOD_STATUS_ENUM } from '../enums';

/**
 *  Describe a payment method object.
 */
export class PaymentMethod {
  /**
   *  Create a PaymentMethod.
   *
   *  @param {Object} options Options for creating a new PaymentMethod object.
   *  @param {Object} [options.icon] Informations about the payment method type icon.
   *  @param {String} options.icon.name Name of the icon.
   *  @param {String} options.icon.data Icon in base64.
   *  @param {String} [options.paymentSubType] Subtype of the payment method.
   *                                           eg: "VISA" for the payment type "CREDIT_CARD".
   *  @param {String} options.status The status of the payment method.
   *  @param {Number} options.paymentMethodId The unique payment method ID.
   *  @param {Boolean} options.default Flag indicating if the payment method is the default one.
   *  @param {String} [options.description] Custom customer description.
   *  @param {String} [options.expirationDate] Expiration date of the payment method.
   *  @param {String} options.paymentType Payment method type.
   *  @param {Number} [options.billingContactId] The ID of the associated billing contact.
   *  @param {String} [options.lastUpdate] Last update date of the payment method.
   *  @param {String} [options.creationDate] Creation date of the payment method.
   *  @param {Number} [options.paymentMeanId] Payment mean ID associated to this payment method.
   *                                          Used to ensure migration.
   *  @param {Number} [options.label] Payment method public label.
   *  @param {Object} [options.original] An OvhPaymentMean object instance if legacy.
   */
  constructor(options) {
    /**
     *  Informations about the payment method type icon.
     *  This object is represented by the icon name and the icon data.
     *  @type {Object}
     */
    this.icon = options.icon;

    /**
     *  Subtype of the payment method (eg: "VISA" for the payment type "CREDIT_CARD").
     *  @type {String}
     */
    this.paymentSubType = options.paymentSubType;

    /**
     *  The status of the payment method.
     *  @type {String}
     */
    this.status = options.status;

    /**
     *  The unique payment method ID.
     *  @type {Number}
     */
    this.paymentMethodId = options.paymentMethodId;

    /**
     *  Flag indicating if the payment method is the default one.
     *  @type {Boolean}
     *  @default false
     */
    this.default = options.default || false;

    /**
     *  Custom customer description.
     *  @type {String}
     *  @default null
     */
    this.description = options.description;

    /**
     *  Expiration date of the payment method.
     *  @type {Date}
     *  @default null
     */
    this.expirationDate = options.expirationDate
      ? new Date(options.expirationDate)
      : null;

    /**
     *  The type of the payment method.
     *  @type {PaymentMethodType}
     */
    this.type = new PaymentMethodType(options.paymentType);

    /**
     *  The type of the payment method.
     *  @type {PaymentMethodType}
     */
    // this.type = new PaymentMethodType(options.paymentType);

    /**
     *  The ID of the associated billing contact.
     *  @type {Number}
     *  @default null
     */
    this.billingContactId = options.billingContactId || null;

    /**
     *  Last update date of the payment method.
     *  @type {Date}
     */
    this.lastUpdate = new Date(options.lastUpdate);

    /**
     *  Creation date of the payment method.
     *  @type {Date}
     */
    this.creationDate = new Date(options.creationDate);

    /**
     *  Payment mean ID associated to this payment method. This is used to ensure migration
     *  from paymentMean to paymentMethod.
     *  @type {String}
     *  @default null
     */
    this.paymentMeanId = options.paymentMeanId || null;

    /**
     *  Payment method public label.
     *  @type {String}
     *  @default null
     */
    this.label = options.label || null;

    /**
     *  An OvhPaymentMean object instance representing a legacy payment mean.
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
   *  Determine if payment method is a legacy one (if original attribute is setted).
   *  @return {Boolean} true if payment method is legacy, false otherwise.
   */
  isLegacy() {
    return !isNull(this.original);
  }

  isValid() {
    return this.getStatusCategory() === 'success';
  }

  /**
   * Returns the category of the status between : 'error', 'warning', 'info', 'success'.
   * The category is a pure frontend value and is set arbitrarily. It is meant to be used
   * for displaying and formatting the status correctly.
   * @return {String} category
   */
  getStatusCategory() {
    switch (this.status) {
      case PAYMENT_METHOD_STATUS_ENUM.CANCELED:
      case PAYMENT_METHOD_STATUS_ENUM.ERROR:
      case PAYMENT_METHOD_STATUS_ENUM.EXPIRED:
      case PAYMENT_METHOD_STATUS_ENUM.TOO_MANY_FAILURES:
        return 'error';
      case PAYMENT_METHOD_STATUS_ENUM.CANCELING:
      case PAYMENT_METHOD_STATUS_ENUM.CREATING:
      case PAYMENT_METHOD_STATUS_ENUM.MAINTENANCE:
      case PAYMENT_METHOD_STATUS_ENUM.PAUSED:
        return 'warning';
      case PAYMENT_METHOD_STATUS_ENUM.CREATED:
      case PAYMENT_METHOD_STATUS_ENUM.VALID:
        return 'success';
      default:
        return 'info';
    }
  }
}

export default {
  PaymentMethod,
};
