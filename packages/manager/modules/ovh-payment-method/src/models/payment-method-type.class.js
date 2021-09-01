import { AVAILABLE_PAYMENT_METHOD_TYPE_ENUM } from '../enums/payment-method.enum';

/**
 *  Describe a payment method type object.
 */
export class PaymentMethodType {
  /**
   *  Create a OvhPaymentMethodType.
   *
   *  @param {String} paymentType The name of the payment type.
   */
  constructor(paymentType) {
    /**
     *  Name of the type of a payment method.
     *  Will be use for helper class below.
     *  @type {String}
     */
    this.paymentType = paymentType;
  }

  /**
   * Determine if payment method type is a Bank Account.
   *
   * @return {Boolean}
   */
  isBankAccount() {
    return this.paymentType === AVAILABLE_PAYMENT_METHOD_TYPE_ENUM.BANK_ACCOUNT;
  }

  /**
   * Determine if payment method type is a Credit Card.
   *
   * @return {Boolean}
   */
  isCreditCard() {
    return this.paymentType === AVAILABLE_PAYMENT_METHOD_TYPE_ENUM.CREDIT_CARD;
  }

  /**
   * Determine if payment method type is a Deferred Payment Account.
   *
   * @return {Boolean}
   */
  isDeferredPaymentAccount() {
    return (
      this.paymentType ===
      AVAILABLE_PAYMENT_METHOD_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT
    );
  }

  /**
   * Determine if payment method type is a Paypal account.
   *
   * @return {Boolean}
   */
  isPaypal() {
    return this.paymentType === AVAILABLE_PAYMENT_METHOD_TYPE_ENUM.PAYPAL;
  }
}

export default {
  PaymentMethodType,
};
