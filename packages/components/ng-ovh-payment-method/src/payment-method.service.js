import { filter, find, has, map, remove, some } from 'lodash-es';

import {
  DEFAULT_OPTIONS,
  DEFAULT_TYPE_OPTIONS,
} from './payment-method.constants';

import OvhPaymentMethod from './payment-method.class';
import OvhAvailablePaymentMethod from './available-payment-method.class';

import OvhPaymentMethodLegacy from './legacy/payment-method-legacy';

export default class OvhPaymentMethodService {
  /* @ngInject */
  constructor(
    $log,
    $q,
    $translate,
    $window,
    coreConfig,
    OvhApiMe,
    paymentMethodPageUrl,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.OvhApiMe = OvhApiMe;

    this.ovhPaymentMethodLegacy = new OvhPaymentMethodLegacy(
      $log,
      $q,
      $translate,
      $window,
      OvhApiMe,
      coreConfig.getRegion(),
    );

    this.paymentMethodPageUrl = paymentMethodPageUrl;
  }

  /**
   *  Check if connected user has a default payment method
   *  @return {Boolean}
   */
  hasDefaultPaymentMethod() {
    return this.getDefaultPaymentMethod().then((method) => !!method);
  }

  /**
   *  Get the default payment method of the user.
   *  @return {Object} The default payment method of the connected user.
   */
  getDefaultPaymentMethod() {
    return this.getAllPaymentMethods({
      onlyValid: true,
      transform: true,
    }).then(
      (paymentMethods) =>
        find(
          paymentMethods,
          (method) => method.default || method.defaultPaymentMean,
        ) || null,
    );
  }

  /* ----------  Payment types  ---------- */

  getAvailablePaymentMethodTypes() {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .availableMethods()
      .$promise.then((paymentTypes) => {
        const registerablePaymentTypes = filter(paymentTypes, {
          registerable: true,
        });

        return map(
          registerablePaymentTypes,
          (paymentTypeOptions) =>
            new OvhAvailablePaymentMethod(paymentTypeOptions),
        );
      })
      .catch((error) => (error.status === 404 ? [] : this.$q.reject(error)));
  }

  /**
   *  Get all the available payment method types
   *  @return {Promise} That returns a list of available payment method types
   */
  getAllAvailablePaymentMethodTypes(options = DEFAULT_TYPE_OPTIONS) {
    return this.$q
      .all({
        legacyTypes: this.ovhPaymentMethodLegacy.getAvailablePaymentMethodTypes(
          options,
        ),
        paymentMethodTypes: this.getAvailablePaymentMethodTypes(),
      })
      .then(({ legacyTypes, paymentMethodTypes }) => {
        remove(legacyTypes, ({ paymentType }) => {
          const hasIdentical = some(paymentMethodTypes, (paymentMethodType) => {
            const isSameValue = paymentMethodType.paymentType === paymentType;
            return isSameValue;
          });
          return hasIdentical;
        });

        return [].concat(legacyTypes, paymentMethodTypes);
      });
  }

  /* ----------  Action on paymentMethod  ---------- */

  /**
   *  Add an new payment method
   */
  addPaymentMethod(paymentMethodType, params = {}) {
    if (paymentMethodType.isLegacy()) {
      return this.ovhPaymentMethodLegacy.addPaymentMean(
        paymentMethodType.original,
        params,
      );
    }

    const addParams = params;
    addParams.paymentType = paymentMethodType.paymentType;
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .save({}, addParams)
      .$promise.then((response) => {
        if (has(params, 'orderId') && has(response, 'paymentMethodId')) {
          return this.OvhApiMe.Order()
            .v6()
            .pay(
              {
                orderId: params.orderId,
              },
              {
                paymentMethod: {
                  id: response.paymentMethodId,
                },
              },
            )
            .$promise.then(() => response);
        }

        return this.$q.when(response);
      });
  }

  /**
   *  Edit given payment method
   *  @param  {Object} paymentMethod The payment method to edit
   *  @param  {Object} params        The attributes of payment method to edit
   *  @return {Promise}
   */
  editPaymentMethod(paymentMethod, params) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.isLegacy()) {
      return this.ovhPaymentMethodLegacy.editPaymentMean(
        paymentMethod.original,
        params,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .edit(
        {
          paymentMethodId: paymentMethod.paymentMethodId,
        },
        params,
      ).$promise;
  }

  /**
   *  Set given payment method as default
   *  @param  {Object} paymentMethod The payment method to set as default
   *  @return {Promise}
   */
  setPaymentMethodAsDefault(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.isLegacy()) {
      return this.ovhPaymentMethodLegacy.setPaymentMeanAsDefault(
        paymentMethod.original,
      );
    }

    return this.editPaymentMethod(paymentMethod, {
      default: true,
    });
  }

  /**
   *  Challenge given payment method
   *  @param  {Object} paymentMethod The payment method to edit
   *  @param  {Object} challenge     The challenge value
   *  @return {Promise}
   */
  challengePaymentMethod(paymentMethod, challenge) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.ovhPaymentMethodLegacy.challengePaymentMethod(
        paymentMethod.original,
        challenge,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .challenge(
        {
          paymentMethodId: paymentMethod.paymentMethodId,
        },
        { challenge },
      ).$promise;
  }

  /**
   *  Finalize given payment method registration
   *  @param  {Object} paymentMethod The payment method to finalize
   *  @param  {Object} finalizeData  The data needed for finalizing the payment method registration
   *  @return {Promise}
   */
  finalizePaymentMethod(paymentValidation, finalizeData = {}) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .finalize(
        {
          paymentMethodId: paymentValidation.paymentMethodId,
        },
        finalizeData,
      )
      .$promise.then((paymentMethod) => new OvhPaymentMethod(paymentMethod));
  }

  /**
   *  Delete given payment method
   *  @param  {Object} paymentMethod The paymentMethod to delete
   *  @return {Promise}
   */
  deletePaymentMethod(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.ovhPaymentMethodLegacy.deletePaymentMean(
        paymentMethod.original,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .delete({
        paymentMethodId: paymentMethod.paymentMethodId,
      }).$promise;
  }

  /* ----------  New payment methods  ---------- */

  getPaymentMethod(paymentMethodId) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .get({
        paymentMethodId,
      })
      .$promise.then(
        (paymentMethodOptions) => new OvhPaymentMethod(paymentMethodOptions),
      );
  }

  /**
   *  Get the payment methods returned by /me/payment/method APIs
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @return {Promise}                   That returns an Array of OvhPaymentMethod
   */
  getPaymentMethods(options = DEFAULT_OPTIONS) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .query(
        options.onlyValid
          ? {
              status: 'VALID',
            }
          : {},
      )
      .$promise.then((paymentMethodIds) =>
        this.$q.all(
          map(paymentMethodIds, (paymentMethodId) =>
            this.getPaymentMethod(paymentMethodId),
          ),
        ),
      )
      .catch((error) => (error.status === 404 ? [] : this.$q.reject(error)));
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
    return this.$q
      .all({
        legacies: !this.coreConfig.isRegion('US')
          ? this.ovhPaymentMethodLegacy.getPaymentMeans(options)
          : this.$q.when([]),
        paymentMethods: this.getPaymentMethods(),
      })
      .then(({ legacies, paymentMethods }) => {
        remove(legacies, ({ paymentMethodId }) =>
          some(paymentMethods, {
            paymentMeanId: paymentMethodId,
          }),
        );

        return [].concat(legacies, paymentMethods);
      });
  }
}
