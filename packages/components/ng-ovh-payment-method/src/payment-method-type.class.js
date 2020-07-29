import { PAYMENT_METHOD_TYPE_ENUM } from './payment-method.constants';

/**
 *  Describe a payment method type object.
 */
export default class OvhPaymentMehtodType {
  /**
   *  Create a OvhPaymentMehtodType.
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
    return this.paymentType === PAYMENT_METHOD_TYPE_ENUM.BANK_ACCOUNT;
  }

  /**
   * Determine if payment method type is a Credit Card.
   *
   * @return {Boolean}
   */
  isCreditCard() {
    return this.paymentType === PAYMENT_METHOD_TYPE_ENUM.CREDIT_CARD;
  }

  /**
   * Determine if payment method type is a Deferred Payment Account.
   *
   * @return {Boolean}
   */
  isDeferredPaymentAccount() {
    return (
      this.paymentType === PAYMENT_METHOD_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT
    );
  }

  /**
   * Determine if payment method type is a Paypal account.
   *
   * @return {Boolean}
   */
  isPaypal() {
    return this.paymentType === PAYMENT_METHOD_TYPE_ENUM.PAYPAL;
  }
}
