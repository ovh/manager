import { PaymentMethod, AvailablePaymentMethod } from './models';
import { PAYMENT_METHOD_STATUS_ENUM } from './enums';
import {
  DEFAULT_GET_OPTIONS,
  DEFAULT_GET_AVAILABLE_OPTIONS,
} from './constants';

export const useOvhPaymentMethod = ({ reketInstance }) => {
  const usedReketInstance = reketInstance;

  /*= ================================================
  =            Available Payment Methods            =
  ================================================= */

  const getAvailablePaymentMethods = (
    onlyRegisterable = DEFAULT_GET_AVAILABLE_OPTIONS.onlyRegisterable,
  ) => {
    return usedReketInstance
      .get('/me/payment/availableMethods')
      .then((availableMethods) => {
        const availablePaymentMethods = onlyRegisterable
          ? availableMethods.filter(({ registerable }) => registerable)
          : availableMethods;

        return availablePaymentMethods.map(
          (availableMethod) => new AvailablePaymentMethod(availableMethod),
        );
      })
      .catch((error) => (error.status === 404 ? [] : Promise.reject(error)));
  };

  /**
   *  Get all the available payment method
   *  @return {Promise} That returns a list of available payment methods
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
   */
  const addPaymentMethod = (availablePaymentMethod, params = {}) => {
    return usedReketInstance
      .post('/me/payment/method', {
        ...params,
        paymentType: availablePaymentMethod.paymentType,
      })
      .then((response) => {
        if (params.orderId && response.paymentMethodId) {
          return usedReketInstance.post(`/me/order/${params.orderId}/pay`, {
            paymentMethod: {
              id: response.paymentMethodId,
            },
          });
        }

        return response;
      });
  };

  /**
   *  Edit given payment method
   *
   *  @param  {PaymentMethod}   paymentMethod The payment method to edit
   *  @param  {Object}          params        The attributes of payment method to edit
   *  @return {Promise}         That returns
   */
  const editPaymentMethod = (paymentMethod, params) => {
    return usedReketInstance.put(
      `/me/payment/method/${paymentMethod.paymentMethodId}`,
      params,
    );
  };

  /**
   *  Set given payment method as default.
   *
   *  @param  {PaymentMethod} paymentMethod The payment method to set as default
   *  @return {Promise}
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
  const challengePaymentMethod = (paymentMethod, challenge) => {
    return usedReketInstance.post(
      `/me/payment/method/${paymentMethod.paymentMethodId}/challenge`,
      { challenge },
    );
  };

  /**
   * Add details to your payment method challenge.

   * @param  {Number}   paymentMethodId The payment method to add details
   * @param  {Object}   details         The details to add
   * @return {Promise}  Which returns an object representing a payment method valdiation.
   */
  const addPaymentMethodDetails = (paymentMethodId, details) => {
    return usedReketInstance.post(
      `/me/payment/method/${paymentMethodId}/details`,
      details,
    );
  };

  /**
   *  Finalize given payment method registration
   *  @param  {Object} paymentMethodValidation  The payment method validation object to finalize.
   *  @param  {Object} finalizeData             The data needed for finalizing the payment method
   *                                            registration.
   *  @return {Promise} Which returns an instance of PaymentMethod.
   */
  const finalizePaymentMethod = (
    paymentMethodValidation,
    finalizeData = {},
  ) => {
    return usedReketInstance
      .post(
        `/me/payment/method/${paymentMethodValidation.paymentMethodId}/finalize`,
        finalizeData,
      )
      .then((paymentMethodOptions) => new PaymentMethod(paymentMethodOptions));
  };

  /**
   *  Delete given payment method.

   *  @param  {PaymentMethod} paymentMethod The paymentMethod to delete
   *  @return {Promise}
   */
  const deletePaymentMethod = (paymentMethod) => {
    return usedReketInstance.delete(
      `/me/payment/method/${paymentMethod.paymentMethodId}`,
    );
  };

  /* -----  End of Actions on payment methods  ------*/

  /**
   * Get the details of a single payment method.
   * This is the result of the call to GET /me/payment/method/{paymentMethodId}
   *
   * @param  {Number} paymentMethodId The payment method id to get
   * @return {PaymentMethod}          The details of the desired payment method
   */
  const getPaymentMethod = (paymentMethodId) => {
    return usedReketInstance
      .get(`/me/payment/method/${paymentMethodId}`)
      .then((paymentMethodOptions) => new PaymentMethod(paymentMethodOptions));
  };

  /**
   *  Get the payment methods returned by /me/payment/method APIs
   *
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @return {Promise}                   That returns an Array of PaymentMethod instances
   */
  const getPaymentMethods = (options = DEFAULT_GET_OPTIONS) => {
    const params = options.onlyValid
      ? {
          status: PAYMENT_METHOD_STATUS_ENUM.VALID,
        }
      : {};

    return usedReketInstance
      .get('/me/payment/method', {
        params,
      })
      .then((paymentMethodIds) =>
        Promise.all(
          paymentMethodIds.map((paymentMethodId) =>
            getPaymentMethod(paymentMethodId),
          ),
        ),
      )
      .catch((error) => (error.status === 404 ? [] : Promise.reject(error)));
  };

  /*= =============================================
  =            Default payment method            =
  ============================================== */

  /**
   *  Get the default payment method of the user.
   *  @return {Promise} That returns the default payment method instance.
   */
  const getDefaultPaymentMethod = () => {
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
   *  @return {Promise} That returns a boolean
   */
  const hasDefaultPaymentMethod = () => {
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
