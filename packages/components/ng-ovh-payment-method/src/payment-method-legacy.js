import _ from 'lodash';

import {
  AVAILABLE_PAYMENT_MEANS,
  DEFAULT_OPTIONS,
} from './payment-method.constant';

export default class OvhPaymentMethodLegacy {
  /* @ngInject */

  constructor($q, $translate, $window, OvhApiMe, target) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.OvhApiMe = OvhApiMe;
    this.target = target;
  }

  /**
   *  Use the legacy APIs to get payment methods:
   *  - /me/paymentMean/* routes for EU and CA
   *  - /me/paymentMethod route for US
   *
   *  @param  {Object} options Options for fetching payment methods
   *  @return {Promise}        That returns an array of payment means (EU/CA) or methods (US)
   */
  getPaymentMethods(options = DEFAULT_OPTIONS) {
    if (this.target !== 'US') {
      return this.getPaymentMeans(options);
    }
    return this.getUSPaymentMethods(options);
  }

  /**
   *  [addPaymentMethod description]
   *  @param {[type]} paymentMethodType   [description]
   *  @param {[type]} paymentMethodParams [description]
   */
  addPaymentMethod(paymentMethodType, paymentMethodParams = {}) {
    if (this.target !== 'US') {
      return this.addPaymentMean(paymentMethodType, paymentMethodParams);
    }

    return this.addUSPaymentMethod(_.merge({
      paymentType: paymentMethodType,
    }, paymentMethodParams));
  }

  /**
   *  Edit a legacy payment method
   *  @param  {Object} legacyPaymentMethod The legacy payment mean or US payment method to edit
   *  @return {Promise}
   */
  editPaymentMethod(legacyPaymentMethod, params) {
    if (this.target !== 'US') {
      return this.editPaymentMean(legacyPaymentMethod, params);
    }

    return this.editUSPaymentMethod(legacyPaymentMethod, params);
  }

  /**
   *  Set a legacy payment method as default. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to set as default
   *  @return {Promise}
   */
  setPaymentMethodAsDefault(legacyPaymentMethod) {
    if (this.target !== 'US') {
      return this.setPaymentMeanAsDefault(legacyPaymentMethod);
    }

    return this.editUSPaymentMethod(legacyPaymentMethod, {
      default: true,
    });
  }

  /**
   *  Delete a legacy payment method. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to delete
   *  @return {Promise}
   */
  deletePaymentMethod(legacyPaymentMethod) {
    if (this.target !== 'US') {
      return this.deletePaymentMean(legacyPaymentMethod);
    }

    return this.deleteUSPaymentMethod(legacyPaymentMethod);
  }

  getAvailablePaymentMethodTypes() {
    const availablePaymentMeans = _.get(AVAILABLE_PAYMENT_MEANS, this.target);

    return this.$q.when(_.chain(availablePaymentMeans)
      .filter({ registerable: true })
      .map(this.transformLegacyPaymentMethodTypeToPaymentMethodType.bind(this))
      .value());
  }

  /* =====================================
  =            Payment Means            =
  ===================================== */

  /**
   *  Get the right v6 resource for /me/paymentMean APIs.
   *
   *  @param  {String} paymentMeanType The type of payment mean that will be used to determine
   *                                   the API route (and so the right resource)
   *  @return {ngResource}
   */
  getPaymentMeanResource(paymentMeanType) {
    return this.OvhApiMe.PaymentMean()[_.startCase(paymentMeanType).split(' ').join('')]().v6();
  }

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
        message: 'getPaymentMeans is not available for US world part',
      });
    }

    const availablePaymentMeans = _.get(AVAILABLE_PAYMENT_MEANS, this.target);

    return this.$q
      .all(_.map(
        availablePaymentMeans,
        type => this.getPaymentMeansOfType(type.value, options),
      ))
      .then(paymentsOfType => _.flatten(paymentsOfType));
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
        message: 'getPaymentMethodOfType is not available for US world part',
      });
    }

    const resource = this.getPaymentMeanResource(paymentMeanType);

    return resource
      .query(paymentMeanType === 'bankAccount' && options.onlyValid ? {
        state: 'valid',
      } : {}).$promise
      .then(paymentMeanIds => this.$q.all(_.map(
        paymentMeanIds,
        paymentMeanId => resource.get({
          id: paymentMeanId,
        }).$promise.then((meanParam) => {
          const mean = meanParam;
          mean.paymentType = paymentMeanType;
          return options.transform
            ? this.transformPaymentMeanToPaymentMethod(mean)
            : mean;
        }),
      )));
  }

  addPaymentMean(paymentMeanType, params = {}) {
    const addParams = params;

    if (_.has(addParams, 'default')) {
      addParams.setDefault = addParams.default;
      delete addParams.default;
    }

    return this.getPaymentMeanResource(paymentMeanType)
      .save({}, addParams)
      .$promise.then((result) => {
        if (result.url && paymentMeanType !== 'bankAccount') {
          this.$window.open(result.url, '_blank');
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
    return this.getPaymentMeanResource(paymentMean.paymentType)
      .edit({
        id: paymentMean.id,
      }, params).$promise;
  }

  /**
   *  Set the given payment mean as default payment
   *  @param  {Object} paymentMean The paymentMean object to set as default
   *  @return {Promise}
   */
  setPaymentMeanAsDefault(paymentMean) {
    return this.getPaymentMeanResource(paymentMean.paymentType)
      .chooseAsDefaultPaymentMean({
        id: paymentMean.id,
      }, {}).$promise;
  }

  /**
   *  Delete the given payment mean
   *  @param  {Object} paymentMean The paymentMean object to delete
   *  @return {Promise}
   */
  deletePaymentMean(paymentMean) {
    return this.getPaymentMeanResource(paymentMean.paymentType)
      .delete({
        id: paymentMean.id,
      }).$promise;
  }

  /* =====  End of Payment Means  ====== */

  /* ==========================================
  =            US Payment Methods            =
  ========================================== */

  /**
   *  Get the US payment methods of logged user.
   *  @param  {Object} options  Options for fetching US payment methods
   *  @return {Promise}         That returns an array of US payment methods
   */
  getUSPaymentMethods(options = DEFAULT_OPTIONS) {
    if (this.target !== 'US') {
      return this.$q.reject({
        status: 403,
        message: `getUSPaymentMethods is not available for ${this.target} world part`,
      });
    }

    return this.OvhApiMe.PaymentMethod().v6()
      .query(options.onlyValid ? {
        status: 'VALID',
      } : {}).$promise
      .then(usPaymentMethodIds => this.$q
        .all(_.map(usPaymentMethodIds, usPaymentMethodId => this.OvhApiMe.PaymentMethod().v6()
          .get({
            id: usPaymentMethodId,
          }).$promise.then(usPaymentMethod => (options.transform
            ? this.transformUSPaymentMethodToPaymentMethod(usPaymentMethod)
            : usPaymentMethod)))));
  }

  addUSPaymentMethod(params) {
    return this.OvhApiMe.PaymentMethod().v6().save({}, params).$promise;
  }

  /**
   *  Edit the given US payment method.
   *  @param  {Object} paymentMean The payment mean to edit
   *  @return {Promise}
   */
  editUSPaymentMethod(usPaymentMethod, params) {
    return this.OvhApiMe.PaymentMethod().v6().edit({
      id: usPaymentMethod.id,
    }, params).$promise;
  }

  /**
   *  Delete given US payment method.
   *  @param  {Object} usPaymentMethod The US payment mean to delete
   *  @return {Promise}
   */
  deleteUSPaymentMethod(usPaymentMethod) {
    return this.OvhApiMe.PaymentMethod().v6().delete({
      id: usPaymentMethod.id,
    }).$promise;
  }

  /*= ====  End of US Payment Methods  ====== */


  /* =========================================
   =            Transform Methods            =
   ========================================= */

  getFullPaymentType(paymentType) {
    return {
      value: _.snakeCase(paymentType).toUpperCase(),
      text: this.$translate.instant(`ovh_payment_type_${_.snakeCase(paymentType)}`),
    };
  }

  getFullPaymentStatus(paymentStatus, paymentType) {
    return {
      value: _.snakeCase(paymentStatus).toUpperCase(),
      text: paymentType === 'bankAccount' && paymentStatus === 'pendingValidation'
        ? this.$translate.instant('ovh_payment_status_waiting_for_documents')
        : this.$translate.instant(`ovh_payment_status_${_.snakeCase(paymentStatus)}`),
    };
  }

  /**
   *  Transform payment mean to payment method.
   *  The goal is to have a coherent object structure between api calls
   *  (/me/payment/method and /me/paymentMean/*)
   */
  transformUSPaymentMethodToPaymentMethod(usPaymentMethod) {
    const paymentType = _.get(usPaymentMethod, 'paymentType', null);
    const paymentStatus = _.get(usPaymentMethod, 'status', null);

    return {
      paymentSubType: _.get(usPaymentMethod, 'paymentSubType', null),
      icon: {
        name: null,
        data: null,
      },
      status: this.getFullPaymentStatus(paymentStatus, paymentType),
      paymentMethodId: usPaymentMethod.id,
      default: _.get(usPaymentMethod, 'default', false),
      description: _.get(usPaymentMethod, 'description', null),
      paymentType: this.getFullPaymentType(paymentType),
      billingContactId: _.get(usPaymentMethod, 'billingContactId', null),
      creationDate: _.get(usPaymentMethod, 'creationDate', null),
      lastUpdate: null,
      label: _.get(usPaymentMethod, 'publicLabel', null),
      original: usPaymentMethod,
    };
  }

  transformPaymentMeanToPaymentMethod(paymentMean) {
    const paymentType = _.get(paymentMean, 'paymentType', null);
    const paymentStatus = _.get(paymentMean, 'state', null);

    return {
      paymentSubType: _.get(paymentMean, 'type', null),
      icon: {
        name: null,
        data: null,
      },
      status: this.getFullPaymentStatus(paymentStatus, paymentType),
      paymentMethodId: paymentMean.id,
      default: _.get(paymentMean, 'defaultPaymentMean', false),
      description: _.get(paymentMean, 'description', null),
      paymentType: this.getFullPaymentType(paymentType),
      billingContactId: null,
      creationDate: _.get(paymentMean, 'creationDate', null),
      lastUpdate: null,
      label: paymentMean.label || paymentMean.number || paymentMean.iban || null,
      original: paymentMean,
    };
  }

  transformLegacyPaymentMethodTypeToPaymentMethodType(legacyPaymentMehtod) {
    return {
      oneshot: true,
      icon: {
        name: null,
        data: null,
      },
      registerable: legacyPaymentMehtod.registerable,
      paymentType: this.getFullPaymentType(legacyPaymentMehtod.value),
      original: legacyPaymentMehtod,
    };
  }

  /* =====  End of Transform Methods  ====== */
}
