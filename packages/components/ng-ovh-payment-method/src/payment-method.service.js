import _ from 'lodash';

import { AVAILABLE_PAYMENT_MEANS } from './payment-method.constant';

const DEFAULT_OPTIONS = {
  onlyValid: false,
  transform: false, // transform legacy payment methods to payment methods
};

export default class OvhPaymentMethodService {
  /* @ngInject */

  constructor($q, $translate, OvhApiMe, target) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.target = target;
  }

  /* =============================================
  =            LEGACY PAYMENT METHODS            =
  ============================================== */

  /**
   *  Use the legacy APIs to get payment methods:
   *  - /me/paymentMean/* routes for EU and CA
   *  - /me/paymentMethod route for US
   *
   *  @param  {Object} options Options for fetching payment methods
   *  @return {Promise}        That returns an array of payment means (EU/CA) or methods (US)
   */
  getLegacyPaymentMethods(options = DEFAULT_OPTIONS) {
    if (this.target !== 'US') {
      return this.getPaymentMeans(options);
    }
    return this.getUSPaymentMethods(options);
  }

  /**
   *  Edit an legacy payment method
   *  @param  {Object} legacyPaymentMethod The legacy payment mean or US payment method to edit
   *  @return {Promise}
   */
  editLegacyPaymentMethod(legacyPaymentMethod, params) {
    if (this.target !== 'US') {
      return this.editPaymentMean(legacyPaymentMethod, params);
    }

    return this.editUSPaymentMethod(legacyPaymentMethod, params);
  }

  /**
   *  Set an legacy payment method as default. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to set as default
   *  @return {Promise}
   */
  setLegacyPaymentMethodAsDefault(legacyPaymentMethod) {
    if (this.target !== 'US') {
      return this.setPaymentMeanAsDefault(legacyPaymentMethod);
    }

    return this.editUSPaymentMethod(legacyPaymentMethod, {
      default: true,
    });
  }

  /**
   *  Delete an legacy payment method. Check the target to call the right API.
   *  @param  {Object} legacyPaymentMethod The legacy payment method to delete
   *  @return {Promise}
   */
  deletelegacyPaymentMethod(legacyPaymentMethod) {
    if (this.target !== 'US') {
      return this.deletePaymentMean(legacyPaymentMethod);
    }

    return this.deleteUSPaymentMethod(legacyPaymentMethod);
  }

  getLegacyPaymentTypes() {
    if (this.target !== 'US') {
      return this.$q.when(_.chain(AVAILABLE_PAYMENT_MEANS)
        .filter({ canBeAdded: true })
        .map('value')
        .map(value => _.snakeCase(value).toUpperCase())
        .value());
    }

    return $q.when(['CREDIT_CARD']);
  }

  /* ----------  Payment Means  ---------- */

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

    return this.$q
      .all(_.map(
        AVAILABLE_PAYMENT_MEANS,
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
            ? this.transformToPaymentMethod(mean)
            : mean;
        }),
      )));
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
      }).$promise;
  }

  deletePaymentMean(paymentMean) {
    return this.getPaymentMeanResource(paymentMean.paymentType)
      .delete({
        id: paymentMean.id,
      }).$promise;
  }

  /* ----------  US Payment Methods  ---------- */

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
            ? this.transformToPaymentMethod(usPaymentMethod)
            : usPaymentMethod)))));
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

  /* -----  End of LEGACY PAYMENT METHODS  ------ */

  /* ----------  Default payment method ---------- */

  /**
   *  Check if connected user has a default payment method
   *  @return {Boolean}
   */
  hasDefaultPaymentMethod() {
    return this.getDefaultPaymentMethod()
      .then(method => (!!method));
  }

  /**
   *  Get the default payment method of the user.
   *  @return {Object} The default payment method of the connected user.
   */
  getDefaultPaymentMethod() {
    return this.getAllPaymentMethods({
      onlyValid: true,
      transform: true,
    }).then(paymentMethods => _.find(paymentMethods, {
      default: true,
    }) || null);
  }

  /* ----------  Payment types  ---------- */

  getAvailablePaymentTypes(translated) {
    return this.$q.all({
      legacyTypes: this.getLegacyPaymentTypes(),
      paymentMethodTypes: this.OvhApiMe.Payment().Method().v6().availableMethods().$promise,
    }).then(({ legacyTypes, paymentMethodTypes }) => {
      console.log(legacyTypes, paymentMethodTypes);
    });

    const paymentTypes = this.target !== 'US' ? AVAILABLE_PAYMENT_MEANS : [];

    if (!translated) {
      return paymentTypes;
    }

    return _.map(paymentTypes, paymentType => ({
      value: paymentType,
      text: this.$translate.instant(`ovh_payment_type_${_.snakeCase(paymentType)}`),
    }));
  }

  /* ----------  Action on paymentMethod  ---------- */

  /**
   *  Edit given payment method
   *  @param  {Object} paymentMethod The payment method to edit
   *  @param  {Object} params        The attributes of payment method to edit
   *  @return {Promise}
   */
  editPaymentMethod(paymentMethod, params) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.editLegacyPaymentMethod(paymentMethod.original, params);
    }

    return this.OvhApiMe.Payment().Method().v6().edit({
      paymentMethodId: paymentMethod.paymentMethodId,
    }, params).$promise;
  }

  /**
   *  Set given payment method as default
   *  @param  {Object} paymentMethod The payment method to set as default
   *  @return {Promise}
   */
  setPaymentMethodAsDefault(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.setLegacyPaymentMethodAsDefault(paymentMethod.original);
    }

    return this.editPaymentMethod(paymentMethod, {
      default: true,
    });
  }

  /**
   *  Delete given payment method
   *  @param  {Object} paymentMethod The paymentMethod to delete
   *  @return {Promise}
   */
  deletePaymentMethod(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.deletelegacyPaymentMethod(paymentMethod.original);
    }

    return this.OvhApiMe.Payment().Method().v6().delete({
      paymentMethodId: paymentMethod.paymentMethodId,
    }).$promise;
  }

  /* ----------  Transform methods  ---------- */

  /**
   *  Transform payment mean to payment method.
   *  The goal is to have a coherent object structure between api calls
   *  (/me/payment/method and /me/paymentMean/*)
   */
  transformToPaymentMethod(paymentMethod) {
    if (this.target !== 'US') {
      return this.transformPaymentMeanToPaymentMethod(paymentMethod);
    }

    return this.transformUSPaymentMethodToPaymentMethod(paymentMethod);
  }

  transformUSPaymentMethodToPaymentMethod(usPaymentMethod) {
    const paymentType = _.get(usPaymentMethod, 'paymentType', null);
    const paymentStatus = _.get(usPaymentMethod, 'status', null);

    return {
      paymentSubType: _.get(usPaymentMethod, 'paymentSubType', null),
      icon: {
        name: null,
        data: null,
      },
      status: {
        value: paymentStatus,
        text: this.$translate.instant(`ovh_payment_status_${_.snakeCase(paymentStatus)}`),
      },
      paymentMethodId: usPaymentMethod.id,
      default: _.get(usPaymentMethod, 'default', false),
      description: _.get(usPaymentMethod, 'description', null),
      paymentType: {
        value: paymentType,
        text: this.$translate.instant(`ovh_payment_type_${_.snakeCase(paymentType)}`),
      },
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
      status: {
        value: paymentStatus,
        text: paymentType === 'bankAccount' && paymentStatus === 'pendingValidation'
          ? this.$translate.instant('ovh_payment_status_waiting_for_documents')
          : this.$translate.instant(`ovh_payment_status_${_.snakeCase(paymentStatus)}`),
      },
      paymentMethodId: paymentMean.id,
      default: _.get(paymentMean, 'defaultPaymentMean', false),
      description: _.get(paymentMean, 'description', null),
      paymentType: {
        value: paymentType,
        text: this.$translate.instant(`ovh_payment_type_${_.snakeCase(paymentType)}`),
      },
      billingContactId: null,
      creationDate: _.get(paymentMean, 'creationDate', null),
      lastUpdate: null,
      label: paymentMean.label || paymentMean.number || paymentMean.iban || null,
      original: paymentMean,
    };
  }

  /* ----------  New payment methods  ---------- */

  /**
   *  Get the payment methods returned by /me/payment/method APIs
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @return {Promise}                   That returns an Array of payment methods
   */
  getPaymentMethods(options = DEFAULT_OPTIONS) {
    return this.OvhApiMe.Payment().Method().v6()
      .query(options.onlyValid ? {
        status: 'VALID',
      } : {}).$promise
      .then(paymentMethodIds => this.$q
        .all(_.map(paymentMethodIds, paymentMethodId => this.OvhApiMe.Payment().Method().v6()
          .get({
            paymentMethodId,
          }).$promise.then((paymentMethodParam) => {
            const paymentMethod = paymentMethodParam;

            // set status object
            paymentMethod.status = {
              value: paymentMethod.status,
              text: this.$translate.instant(`ovh_payment_status_${_.snakeCase(paymentMethod.status)}`),
            };

            // set paymentType object
            paymentMethod.paymentType = {
              value: paymentMethod.paymentType,
              text: this.$translate.instant(`ovh_payment_type_${_.snakeCase(paymentMethod.paymentType)}`),
            };

            return paymentMethod;
          }))));
  }

  /**
   *  Get all payment methods, even the legacy one returned by /me/paymentMean/*
   *  and /me/paymentMethod APIs routes.
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @param  {Boolean} options.onlyValid Gets only valid payment methods
   *  @param  {Boolean} options.transform Flag telling if legacy payment methods needs to be
   *                                      transformed to new payment method object
   *  @return {Promise}                   That returns an Array of payment methods merged
   *                                      with legacy payment methods.
   */
  getAllPaymentMethods(options = DEFAULT_OPTIONS) {
    return this.$q.all({
      legacies: this.getLegacyPaymentMethods(options),
      // paymentMethods: this.getPaymentMethods(),
      paymentMethods: this.$q.when([]),
    }).then(({ legacies, paymentMethods }) => {
      _.remove(legacies, ({ paymentMethodId }) => _.some(paymentMethods, {
        paymentMeanId: paymentMethodId,
      }));

      return [].concat(legacies, paymentMethods);
    });
  }
}
