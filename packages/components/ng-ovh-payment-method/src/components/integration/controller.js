import {
  defaults,
  get,
  isFunction,
  merge,
  noop,
  omit,
  values,
} from 'lodash-es';

import { AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM } from '@ovh-ux/ovh-payment-method';
import { DEFAULT_BINDINGS_VALUES } from './constants';

export default class OvhPaymentMethodIntegrationCtrl {
  /* @ngInject */
  constructor($location, $window, ovhPaymentMethod) {
    this.$location = $location;
    this.$window = $window;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes
    this.loading = {
      init: false,
    };

    this.paymentValidation = null;
    this.paymentMethod = null;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  /**
   *  Build callback urls needed for POST /me/payment/method API call.
   *  @return {Object} With cancel, error, failure, pending and success urls as attributes.
   */
  buildCallbackUrls() {
    // build from scratch to be sure that old query parameters are reset
    // (in case of previous payment error when integration is REDIRECT)
    const { location } = this.$window;

    // take all hash param except callbackStatusParamUrlName if present in current location
    const hashParams = omit(this.$location.search(), [
      this.callbackStatusParamUrlName,
    ]);
    const hashParamsArray = Object.keys(hashParams).map(
      (hashKey) => `${hashKey}=${get(hashParams, hashKey)}`,
    );

    const callbackUrlBase = `${location.protocol}//${location.host}${
      location.pathname
    }#${this.$location.path()}?${hashParamsArray.join('&')}`;
    return {
      cancel: `${callbackUrlBase}${hashParamsArray.length ? '&' : ''}${
        this.callbackStatusParamUrlName
      }=cancel`,
      error: `${callbackUrlBase}${hashParamsArray.length ? '&' : ''}${
        this.callbackStatusParamUrlName
      }=error`,
      failure: `${callbackUrlBase}${hashParamsArray.length ? '&' : ''}${
        this.callbackStatusParamUrlName
      }=failure`,
      pending: `${callbackUrlBase}${hashParamsArray.length ? '&' : ''}${
        this.callbackStatusParamUrlName
      }=pending`,
      success: `${callbackUrlBase}${hashParamsArray.length ? '&' : ''}${
        this.callbackStatusParamUrlName
      }=success`,
    };
  }

  /**
   *  Call callback defined in bindings.
   *  This method call the different callbacks by reference or by passing an object literal.
   *  @param  {String} callbackName       The callback name defined in directive scope (bindings)
   *  @param  {Object} callbackArgsObject An object used for passing data by Object literal.
   *                                      For function reference only values matter.
   *  @return {*} Values returned by callback call.
   */
  manageCallback(callbackName, callbackArgsObject) {
    // get the callback from binding
    const callbackFn = get(this, callbackName);

    if (!callbackFn) {
      return null;
    }

    // if it's a function reference ...
    // otherwise the call will be made passing an Object Literal
    // when testing if the callback function is a function ref or not
    let callbackResponse = callbackFn(callbackArgsObject);

    if (isFunction(callbackResponse)) {
      // ... invoke it
      callbackResponse = callbackFn().apply(this, values(callbackArgsObject));
    }

    return callbackResponse;
  }

  /* -----  End of Helpers  ------ */

  /* ================================
  =            Callbacks            =
  ================================= */

  onIntegrationInitialized(submitFn = noop) {
    // call onInitialized callback
    const renderOptions = this.manageCallback('onInitialized', { submitFn });

    // reset init loading flag
    this.loading.init = false;

    // return the rendering options that has been returned by the onInitialized callback
    return renderOptions || {};
  }

  onIntegrationSubmit(additionalParams = {}) {
    return new Promise((resolve) => {
      // call onInitialized callback
      const onSubmitReturn = this.manageCallback('onSubmit', additionalParams);

      return resolve(onSubmitReturn);
    }).then((postParams = {}) => {
      // merge postParams with default values if not provided
      const postData = merge(
        {
          default: false,
          register: true,
          callbackUrl: this.buildCallbackUrls(),
        },
        postParams,
      );

      // create payment method by posting to /me/payment/method API route
      return this.ovhPaymentMethod
        .addPaymentMethod(this.paymentMethodType, postData)
        .then((paymentValidation) => {
          this.paymentValidation = paymentValidation;

          // if payment method type doesn't require finalization
          // call onSubmitSuccess callback
          if (
            !this.paymentMethodType.isRequiringFinalization() &&
            ![
              AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.COMPONENT,
              AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.REDIRECT,
            ].includes(this.paymentMethodType.integration)
          ) {
            this.manageCallback('onSubmitSuccess', { paymentValidation });
          }

          return this.paymentValidation;
        })
        .catch((error) => {
          // in all case (even with finalize required) call onSubmitError callback
          this.manageCallback('onSubmitError', { error });
          return Promise.reject(error);
        });
    });
  }

  onIntegrationFinalize(finalizeData = {}) {
    return this.ovhPaymentMethod
      .finalizePaymentMethod(this.paymentValidation, finalizeData)
      .then((paymentMethod) => {
        this.paymentMethod = paymentMethod;

        // call onSubmitSuccess callback
        this.manageCallback('onSubmitSuccess', { paymentMethod });

        return this.paymentMethod;
      })
      .catch((error) => {
        // call onSubmitError callback
        this.manageCallback('onSubmitError', { error });
      });
  }

  /* -----  End of Callbacks  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    // set default bindings values
    defaults(this, DEFAULT_BINDINGS_VALUES);

    this.loading.init = true;

    // reset paymentValidation object
    this.paymentValidation = null;
    // reset paymentMethod object
    this.paymentMethod = null;
  }

  /* -----  End of Hooks  ------ */
}
