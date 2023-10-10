import { flatten, has } from 'lodash-es';
import { PaymentMeanBankAccount } from './models/payment-mean/payment-mean-bank-account.class';
import { PaymentMeanCreditCard } from './models/payment-mean/payment-mean-credit-card.class';
import { PaymentMeanDeferredPaymentAccount } from './models/payment-mean/payment-mean-deferred-payment-account.class';
import { PaymentMeanPaypal } from './models/payment-mean/payment-mean-paypal.class';

import { AVAILABLE_PAYMENT_MEAN_TYPES, DEFAULT_GET_OPTIONS } from './constants';

import { PAYMENT_MEAN_TYPE_ENUM } from './enums/payment-mean.enum';

export const usePaymentMean = ({ axiosInstance, region }) => {
  const buildRejectError = (errorObject) => {
    const paymentMeanError = new Error(errorObject.data.message);
    paymentMeanError.status = errorObject.status;
    paymentMeanError.data = errorObject.data;
    return paymentMeanError;
  };

  /*= ===============================================
  =            Actions on payment means            =
  ================================================ */

  const addPaymentMean = (availablePaymentMean, params = {}) => {
    if (region === 'US') {
      return Promise.reject(
        buildRejectError({
          status: 403,
          data: {
            message: 'addPaymentMean is not available for US world part',
          },
        }),
      );
    }

    const addParams = params;

    if (has(addParams, 'default')) {
      addParams.setDefault = addParams.default;
      delete addParams.default;
    }

    return axiosInstance
      .post(`/me/paymentMean/${availablePaymentMean.meanType}`, addParams)
      .then(({ data }) => data)
      .then((result) => {
        if (
          result.url &&
          availablePaymentMean.meanType !== PAYMENT_MEAN_TYPE_ENUM.bankAccount
        ) {
          if (!params.returnUrl) {
            window.open(result.url, '_blank', 'noopener');
          } else {
            window.location = result.url;
          }
        }

        return result;
      });
  };

  /**
   *  Edit the given payment mean.
   *
   *  @param  {PaymentMean} paymentMean The payment mean to edit
   *  @return {Promise}
   */
  const editPaymentMean = (paymentMean, params) => {
    if (region === 'US') {
      return Promise.reject(
        buildRejectError({
          status: 403,
          data: {
            message: 'editPaymentMean is not available for US world part',
          },
        }),
      );
    }

    return axiosInstance
      .put(`/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}`, params)
      .then(({ data }) => data);
  };

  /**
   *  Set the given payment mean as default payment.

   *  @param  {PaymentMean} paymentMean The paymentMean object to set as default
   *  @return {Promise}
   */
  const setDefaultPaymentMean = (paymentMean) => {
    return axiosInstance
      .post(
        `/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}/chooseAsDefaultPaymentMean`,
      )
      .then(({ data }) => data);
  };

  /**
   *  Delete the given payment mean.
   *
   *  @param  {PaymentMean} paymentMean The paymentMean object to delete
   *  @return {Promise}
   */
  const deletePaymentMean = (paymentMean) => {
    return axiosInstance
      .delete(`/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}`)
      .then(({ data }) => data);
  };

  /* -----  End of Actions on payment means  ------*/

  /**
   * Get a payment mean with given id and type.
   *
   * @param  {Number} paymentMeanId The unique id of the payment mean.
   * @param  {String} paymentType   The type of the payment mean. (used to build right API url).
   *
   * @return {Promise}              Which returns an instance of PaymentMean.
   */
  const getPaymentMeanOfType = (paymentMeanId, paymentMeanType, transform) => {
    if (region === 'US') {
      return Promise.reject(
        buildRejectError({
          status: 403,
          data: {
            message: 'getPaymentMeanOfType is not available for US world part',
          },
        }),
      );
    }

    return axiosInstance
      .get(`/me/paymentMean/${paymentMeanType}/${paymentMeanId}`)
      .then(({ data }) => data)
      .then((meanOptions) => {
        let paymentMean;
        switch (paymentMeanType) {
          case PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT:
            paymentMean = new PaymentMeanBankAccount(meanOptions);
            break;
          case PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD:
            paymentMean = new PaymentMeanCreditCard(meanOptions);
            break;
          case PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT:
            paymentMean = new PaymentMeanDeferredPaymentAccount(meanOptions);
            break;
          case PAYMENT_MEAN_TYPE_ENUM.PAYPAL:
            paymentMean = new PaymentMeanPaypal(meanOptions);
            break;
          default:
            break;
        }

        return transform ? paymentMean.toPaymentMethod() : paymentMean;
      });
  };

  /**
   * Get a payment mean with given id and type.
   *
   * @param  {Number} paymentMeanId The unique id of the payment mean.
   * @param  {String} paymentType   The type of the payment mean. (used to build right API url).
   *
   * @return {Promise}              Which returns an instance of PaymentMean.
   */
  const getPaymentMeansOfType = (
    paymentMeanType,
    options = DEFAULT_GET_OPTIONS,
  ) => {
    if (region === 'US') {
      return Promise.reject(
        buildRejectError({
          status: 403,
          data: {
            message: 'getPaymentMeansOfType is not available for US world part',
          },
        }),
      );
    }

    const paymentMeanUrl = `/me/paymentMean/${paymentMeanType}`;
    const params =
      paymentMeanType === PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT &&
      options.onlyValid
        ? {
            state: 'valid',
          }
        : {};

    return axiosInstance
      .get(paymentMeanUrl, {
        params,
      })
      .then(({ data }) => data)
      .then((paymentMeanIds) =>
        Promise.all(
          paymentMeanIds.map((paymentMeanId) =>
            getPaymentMeanOfType(
              paymentMeanId,
              paymentMeanType,
              options.transform,
            ),
          ),
        ),
      );
  };

  /**
   *  Get all payment means of the logged user.
   *  This method is not available for US as the API doesn't exists.
   *
   *  @param  {Object} options Options for fetching payment methods
   *  @return {Promise}        That returns an array of payment means.
   */
  const getPaymentMeans = (options = DEFAULT_GET_OPTIONS) => {
    if (region === 'US') {
      return Promise.reject(
        buildRejectError({
          status: 403,
          data: {
            message: 'getPaymentMeans is not available for US world part',
          },
        }),
      );
    }

    const availablePaymentMeanTypes =
      AVAILABLE_PAYMENT_MEAN_TYPES[region] || [];

    return Promise.all(
      availablePaymentMeanTypes.map(({ value }) =>
        getPaymentMeansOfType(value, options),
      ),
    ).then((paymentsOfType) => flatten(paymentsOfType));
  };

  return {
    addPaymentMean,
    editPaymentMean,
    deletePaymentMean,
    getPaymentMeans,
    setDefaultPaymentMean,
  };
};

export default {
  usePaymentMean,
};
