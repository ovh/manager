import { v6 } from '@ovh-ux/manager-core-api';
import { PaymentMethod, AvailablePaymentMethod } from './models';
import { PAYMENT_METHOD_STATUS_ENUM } from './enums';
import {
  DEFAULT_GET_OPTIONS,
  DEFAULT_GET_AVAILABLE_OPTIONS,
} from './constants';

export const useOvhPaymentMethod = () => {
  /*= ================================================
  =            Available Payment Methods            =
  ================================================= */

  /**
   * Get the available payment methods
   * @param {boolean} onlyRegisterable If true, only the registerable payment methods will be returned
   * @returns {Promise<Array<AvailablePaymentMethod>>}
   */
  const getAvailablePaymentMethods = async (
    onlyRegisterable = DEFAULT_GET_AVAILABLE_OPTIONS.onlyRegisterable,
  ) => {
    return v6
      .get('/me/payment/availableMethods')
      .then(({ data }) => data)
      .catch((error) =>
        error.response.status === 404 ? [] : Promise.reject(error),
      )
      .then((availableMethods) => {
        const availablePaymentMethods = onlyRegisterable
          ? availableMethods.filter(({ registerable }) => registerable)
          : availableMethods;

        return availablePaymentMethods.map(
          (availableMethod) => new AvailablePaymentMethod(availableMethod),
        );
      });
  };

  /**
   *  Get all the available payment methods that are registerable
   *  @return {Promise<Array<AvailablePaymentMethod>>} That returns a list of available payment methods
   */
  const getAllAvailablePaymentMethods = (
    options = DEFAULT_GET_AVAILABLE_OPTIONS,
  ) =>
    getAvailablePaymentMethods(options.onlyRegisterable).then(
      (availablePaymentMethods) => availablePaymentMethods,
    );

  /* -----  End of Available Payment Methods  ------*/

  /*= =================================================
  =            Actions on payment methods            =
  ================================================== */

  /**
   *  Add an new payment method
   *  @param  {Object}          params The attributes of payment method to add
   *  @return {Promise<PaymentMethod>} returns an instance of PaymentMethod.
   */
  const addPaymentMethod = async (availablePaymentMethod, params = {}) => {
    return v6
      .post('/me/payment/method', {
        ...params,
        paymentType: availablePaymentMethod.paymentType,
      })
      .then(({ data }) => new PaymentMethod(data))
      .then((paymentMethod) => {
        if (params.orderId && paymentMethod.paymentMethodId) {
          return v6
            .post(`/me/order/${params.orderId}/pay`, {
              paymentMethod: {
                id: paymentMethod.paymentMethodId,
              },
            })
            .then(({ data }) => new PaymentMethod(data));
        }

        return paymentMethod;
      });
  };

  /**
   *  Edit given payment method
   *
   *  @param  {PaymentMethod}   paymentMethod The payment method to edit
   *  @param  {Object}          params        The attributes of payment method to edit
   *  @return {Promise<PaymentMethod>}         That returns
   */
  const editPaymentMethod = async (paymentMethod, params) => {
    return v6
      .put(`/me/payment/method/${paymentMethod.paymentMethodId}`, params)
      .then(({ data }) => new PaymentMethod(data));
  };

  /**
   *  Set given payment method as default.
   *
   *  @param  {PaymentMethod} paymentMethod The payment method to set as default
   *  @return {Promise<PaymentMethod>}
   */
  const setDefaultPaymentMethod = (paymentMethod) => {
    return editPaymentMethod(paymentMethod, {
      default: true,
    });
  };

  /**
   *  Challenge given payment method.

   *  @param  {PaymentMethod} paymentMethod The payment method to challenge
   *  @param  {Object}        challenge     The challenge value
   *  @return {Promise}
   */
  const challengePaymentMethod = async (paymentMethod, challenge) => {
    return v6
      .post(`/me/payment/method/${paymentMethod.paymentMethodId}/challenge`, {
        challenge,
      })
      .then(({ data }) => data);
  };

  /**
   * Add details to your payment method challenge.

   * @param  {Number}   paymentMethodId The payment method to add details
   * @param  {Object}   details         The details to add
   * @return {Promise}  Which returns an object representing a payment method valdiation.
   */
  const addPaymentMethodDetails = async (paymentMethodId, details) => {
    return v6
      .post(`/me/payment/method/${paymentMethodId}/details`, details)
      .then(({ data }) => data);
  };

  /**
   *  Finalize given payment method registration
   *  @param  {Object} paymentMethodValidation  The payment method validation object to finalize.
   *  @param  {Object} finalizeData             The data needed for finalizing the payment method
   *                                            registration.
   *  @return {Promise<PaymentMethod>} Which returns an instance of PaymentMethod.
   */
  const finalizePaymentMethod = async (
    paymentMethodValidation,
    finalizeData = {},
  ) => {
    return v6
      .post(
        `/me/payment/method/${paymentMethodValidation.paymentMethodId}/finalize`,
        finalizeData,
      )
      .then(({ data }) => new PaymentMethod(data));
  };

  /**
   *  Delete given payment method.

   *  @param  {PaymentMethod} paymentMethod The paymentMethod to delete
   *  @return {Promise<PaymentMethod>}
   */
  const deletePaymentMethod = async (paymentMethod) => {
    return v6
      .delete(`/me/payment/method/${paymentMethod.paymentMethodId}`)
      .then(({ data }) => new PaymentMethod(data));
  };

  /* -----  End of Actions on payment methods  ------*/

  /**
   * Get the details of a single payment method.
   * This is the result of the call to GET /me/payment/method/{paymentMethodId}
   *
   * @param  {Number} paymentMethodId The payment method id to get
   * @return {Promise<PaymentMethod>}          The details of the desired payment method
   */
  const getPaymentMethod = (paymentMethodId) => {
    return v6
      .get(`/me/payment/method/${paymentMethodId}`)
      .then(({ data }) => new PaymentMethod(data));
  };

  /**
   *  Get the payment methods returned by /me/payment/method APIs
   *
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @return {Promise<Array<PaymentMethod>>}                   That returns an Array of PaymentMethod instances
   */
  const getPaymentMethods = async (options = DEFAULT_GET_OPTIONS) => {
    const params = options.onlyValid
      ? {
          status: PAYMENT_METHOD_STATUS_ENUM.VALID,
        }
      : {};

    return v6
      .get('/me/payment/method', {
        params,
      })
      .then(({ data }) => data)
      .catch((error) =>
        error.response.status === 404 ? [] : Promise.reject(error),
      )
      .then((paymentMethodIds) =>
        Promise.all(
          paymentMethodIds.map((paymentMethodId) =>
            getPaymentMethod(paymentMethodId),
          ),
        ),
      );
  };

  /*= =============================================
  =            Default payment method            =
  ============================================== */

  /**
   *  Get the default payment method of the user.
   *  @return {Promise<PaymentMethod | null>} That returns the default payment method instance.
   */
  const getDefaultPaymentMethod = async () => {
    return getPaymentMethods({
      onlyValid: true,
      transform: true,
    }).then(
      (paymentMethods) =>
        paymentMethods.find((method) => method.default) || null,
    );
  };

  /**
   *  Check if connected user has a default payment method.
   *  @return {Promise<boolean>} That returns a boolean
   */
  const hasDefaultPaymentMethod = async () => {
    return getDefaultPaymentMethod().then((method) => !!method);
  };

  /* -----  End of Default payment method  ------*/

  return {
    addPaymentMethod,
    editPaymentMethod,
    setDefaultPaymentMethod,
    challengePaymentMethod,
    addPaymentMethodDetails,
    finalizePaymentMethod,
    deletePaymentMethod,
    getAvailablePaymentMethods,
    getAllAvailablePaymentMethods,
    getPaymentMethod,
    getPaymentMethods,
    getDefaultPaymentMethod,
    hasDefaultPaymentMethod,
  };
};

export default {
  useOvhPaymentMethod,
};
