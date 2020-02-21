import { filter, flatten, get, has, map } from 'lodash-es';

import {
  DEFAULT_OPTIONS,
  DEFAULT_TYPE_OPTIONS,
} from '../payment-method.constants';

import {
  AVAILABLE_PAYMENT_MEANS,
  PAYMENT_MEAN_TYPE_ENUM,
} from './mean/payment-mean.constants';

// legacies payment means classes
import OvhPaymentMeanBankAccount from './mean/payment-mean-bank-account.class';
import OvhPaymentMeanCreditCard from './mean/payment-mean-credit-card.class';
import OvhPaymentMeanDeferredPaymentAccount from './mean/payment-mean-deferred-payment-account.class';
import OvhPaymentMeanPaypal from './mean/payment-mean-paypal.class';
import OvhPaymentMeanType from './mean/payment-mean-type.class';

export default class OvhPaymentMethodLegacy {
  /* @ngInject */
  constructor($http, $log, $q, $translate, $window, target) {
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.target = target;
  }

  /**
   *  @deprecated - use addPaymentMean method instead
   *  Add a legacy payment method
   *  @param  {Object} paymentMethodType The legacy payment mean to add.
   *  @param  {Object} paymentMethodParams Add params passed to the POST request.
   *  @return {Promise}
   */
  addPaymentMethod(paymentMethodType, paymentMethodParams = {}) {
    this.$log.warn(
      '[Deprecation warning]: use addPaymentMean method instead of addPaymentMethod',
    );
    return this.addPaymentMean(paymentMethodType, paymentMethodParams);
  }

  /**
   *  @deprecated - use editPaymentMean method instead
   *  Edit a legacy payment method
   *  @param  {Object} legacyPaymentMethod The legacy payment mean or US payment method to edit
   *  @return {Promise}
   */
  editPaymentMethod(legacyPaymentMethod, params) {
    this.$log.warn(
      '[Deprecation warning]: use editPaymentMean method instead of editPaymentMethod',
    );
    return this.editPaymentMean(legacyPaymentMethod, params);
  }

  /**
   *  @deprecated - use setPaymentMeanAsDefault method instead
   *  Set a legacy payment method as default. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to set as default
   *  @return {Promise}
   */
  setPaymentMethodAsDefault(legacyPaymentMethod) {
    this.$log.warn(
      '[Deprecation warning]: use setPaymentMeanAsDefault method instead of setPaymentMethodAsDefault',
    );
    return this.setPaymentMeanAsDefault(legacyPaymentMethod);
  }

  /**
   *  Challenge a legacy payment method. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to set as default
   *  @param  {Object} challenge The challenge value
   *  @return {Promise}
   */
  challengePaymentMethod(legacyPaymentMethod, challenge) {
    if (this.target === 'US') {
      return this.$q.reject({
        status: 403,
        message: 'challengePaymentMean is not available for US world part',
      });
    }
    return this.challengePaymentMean(legacyPaymentMethod, challenge);
  }

  /**
   *  @deprecated - use deletePaymentMean method instead
   *  Delete a legacy payment method. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to delete
   *  @return {Promise}
   */
  deletePaymentMethod(legacyPaymentMethod) {
    this.$log.warn(
      '[Deprecation warning]: use deletePaymentMean method instead of deletePaymentMethod',
    );
    return this.deletePaymentMean(legacyPaymentMethod);
  }

  /**
   *  Get available payment mean types. This will regroup the infos provided by API
   *  with the infos from constants.
   *  @return {Promise} That returns an array of available payment means
   *                    transformed to payment method types.
   */
  getAvailablePaymentMethodTypes(options = DEFAULT_TYPE_OPTIONS) {
    const availablePromise = this.$q.when(
      get(AVAILABLE_PAYMENT_MEANS, this.target),
    );

    return this.$q
      .all({
        infos: availablePromise,
        availableMeans: this.$http
          .get('/me/availableAutomaticPaymentMeans')
          .then(({ data }) => data),
      })
      .then(({ infos, availableMeans }) => {
        const registerablePaymentMeans = filter(infos, (paymentMeanInfos) => {
          if (!get(availableMeans, paymentMeanInfos.value)) {
            return false;
          }

          if (options.onlyRegisterable && !paymentMeanInfos.registerable) {
            return false;
          }

          return true;
        });

        return map(registerablePaymentMeans, (meanTypeOptions) => {
          const meanType = new OvhPaymentMeanType(meanTypeOptions);

          return options.transform
            ? meanType.toAvailablePaymentMethod()
            : meanType;
        });
      });
  }

  /* =====================================
  =            Payment Means            =
  ===================================== */

  /**
   *  Get all payment means of the logged user.
   *  This method is not available for US as the API doesn't exists.
   *
   *  @param  {Object} options Options for fetching payment methods
   *  @return {Promise}        That returns an array of payment means.
   */
  getPaymentMeans(options = DEFAULT_OPTIONS) {
    if (this.target === 'US') {
      return this.$q.reject({
        status: 403,
        data: {
          message: 'getPaymentMeans is not available for US world part',
        },
      });
    }

    const availablePaymentMeans = get(AVAILABLE_PAYMENT_MEANS, this.target);

    return this.$q
      .all(
        map(availablePaymentMeans, (type) =>
          this.getPaymentMeansOfType(type.value, options),
        ),
      )
      .then((paymentsOfType) => flatten(paymentsOfType));
  }

  /**
   *  Get the payment means of given type.
   *
   *  @param  {String} paymentMeanType The type of payment mean to get
   *  @param  {Object} options         Options for fetching payment means
   *  @return {Promise}                That returns an Array with all the payment means of
   *                                   given type.
   */
  getPaymentMeansOfType(paymentMeanType, options = DEFAULT_OPTIONS) {
    if (this.target === 'US') {
      return this.$q.reject({
        status: 403,
        data: {
          message: 'getPaymentMethodOfType is not available for US world part',
        },
      });
    }

    const params =
      paymentMeanType === 'bankAccount' && options.onlyValid
        ? {
            state: 'valid',
          }
        : {};

    return this.$http
      .get(`/me/paymentMean/${paymentMeanType}`, {
        params,
      })
      .then(({ data }) => data)
      .then((paymentMeanIds) =>
        this.$q.all(
          map(paymentMeanIds, (paymentMeanId) =>
            this.$http
              .get(`/me/paymentMean/${paymentMeanType}/${paymentMeanId}`)
              .then(({ data }) => data)
              .then((mean) => {
                let paymentMean;
                switch (paymentMeanType) {
                  case PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT:
                    paymentMean = new OvhPaymentMeanBankAccount(mean);
                    break;
                  case PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD:
                    paymentMean = new OvhPaymentMeanCreditCard(mean);
                    break;
                  case PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT:
                    paymentMean = new OvhPaymentMeanDeferredPaymentAccount(
                      mean,
                    );
                    break;
                  case PAYMENT_MEAN_TYPE_ENUM.PAYPAL:
                    paymentMean = new OvhPaymentMeanPaypal(mean);
                    break;
                  default:
                    break;
                }

                return options.transform
                  ? paymentMean.toPaymentMethod()
                  : paymentMean;
              }),
          ),
        ),
      );
  }

  addPaymentMean(paymentMean, params = {}) {
    const addParams = params;

    if (has(addParams, 'default')) {
      addParams.setDefault = addParams.default;
      delete addParams.default;
    }

    return this.$http
      .post(`/me/paymentMean/${paymentMean.meanType}`, addParams)
      .then(({ data }) => data)
      .then((result) => {
        if (result.url && paymentMean.meanType !== 'bankAccount') {
          if (!params.returnUrl) {
            this.$window.open(result.url, '_blank');
          } else {
            this.$window.location = result.url;
          }
        }

        return result;
      });
  }

  /**
   *  Edit the given payment mean.
   *  @param  {Object} paymentMean The payment mean to edit
   *  @return {Promise}
   */
  editPaymentMean(paymentMean, params) {
    return this.$http
      .put(`/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}`, params)
      .then(({ data }) => data);
  }

  /**
   *  Set the given payment mean as default payment
   *  @param  {Object} paymentMean The paymentMean object to set as default
   *  @return {Promise}
   */
  setPaymentMeanAsDefault(paymentMean) {
    return this.$http
      .post(
        `/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}/chooseAsDefaultPaymentMean`,
        null,
      )
      .then(({ data }) => data);
  }

  /**
   *  Delete the given payment mean
   *  @param  {Object} paymentMean The paymentMean object to delete
   *  @return {Promise}
   */
  deletePaymentMean(paymentMean) {
    return this.$http
      .delete(
        `/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}/chooseAsDefaultPaymentMean`,
      )
      .then(({ data }) => data);
  }

  /**
   *  Challenge the given payment mean
   *  @param  {Object} paymentMean The paymentMean object to delete
   *  @param  {Object} challenge The challenge value
   *  @return {Promise}
   */
  challengePaymentMean(paymentMean, challenge) {
    return this.$http
      .post(
        `/me/paymentMean/${paymentMean.meanType}/${paymentMean.id}/challenge`,
        {
          challenge,
        },
      )
      .then(({ data }) => data);
  }

  /* =====  End of Payment Means  ====== */

  /* ==========================================
  =            US Payment Methods            =
  ========================================== */

  /**
   *  @deprecated
   *  Should not be used anymore as legacy (original) payment methods
   *  are not returned anymore by the library in the US.
   *  Reject if method is still called before deleting it.
   */
  addUSPaymentMethod() {
    this.$log.warn(
      '[Deprecation warning]: addUSPaymentMethod method is no longer available',
    );
    return this.$q.reject({
      status: 404,
      data: {
        message: 'POST /me/paymentMethod is no longer available.',
      },
    });
  }

  /**
   *  @deprecated
   *  Should not be used anymore as legacy (original) payment methods
   *  are not returned anymore by the library in the US.
   *  Reject if method is still called before deleting it.
   */
  editUSPaymentMethod() {
    this.$log.warn(
      '[Deprecation warning]: editUSPaymentMethod method is no longer available',
    );
    return this.$q.reject({
      status: 404,
      data: {
        message:
          'PUT /me/paymentMethod/{paymentMethodId} is no longer available.',
      },
    });
  }

  /**
   *  @deprecated
   *  Should not be used anymore as legacy (original) payment methods
   *  are not returned anymore by the library in the US.
   *  Reject if method is still called before deleting it.
   */
  deleteUSPaymentMethod() {
    this.$log.warn(
      '[Deprecation warning]: deleteUSPaymentMethod method is no longer available',
    );
    return this.$q.reject({
      status: 404,
      data: {
        message:
          'DELETE /me/paymentMethod/{paymentMethodId} is no longer available.',
      },
    });
  }

  /*= ====  End of US Payment Methods  ====== */
}
