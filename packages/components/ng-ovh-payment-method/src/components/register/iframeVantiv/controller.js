import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';

import IframeVantivInstance from './instance.class';
import { VANTIV_RESPONSE_CODE } from './constants';

export default class OvhPaymentMethodRegisterIframeVantivCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod) {
    // dependencies injections
    this.ovhPaymentMethod = ovhPaymentMethod;

    this.registerInstance = null;
  }

  /**
   *  Init the controller for Vantiv Iframe management.
   *  This mean that Vantiv script has been loaded and is ready to be used.
   *  As $onInit is potentially called before the loading of the Vantiv script,
   *  we declare an init method that will be called in directive's link function
   *  when script is loaded.
   */
  init() {
    // create the register instance
    this.registerInstance = new IframeVantivInstance({
      callback: this.onIframeSubmitted.bind(this),
    });
    // callback to parent controller
    this.registerCtrl.onRegisterComponentInitialized(this.registerInstance);
  }

  onIframeSubmitted(response) {
    const responseCode = parseInt(get(response, 'response', '-1'), 10);

    if (responseCode === VANTIV_RESPONSE_CODE.SUCCESS) {
      // finalize the payment registration
      return this.ovhPaymentMethod
        .finalizePaymentMethod(this.registerInstance.submittedPaymentMethod, {
          expirationMonth: parseInt(response.expMonth, 10),
          expirationYear: parseInt(response.expYear, 10),
          registrationId: response.paypageRegistrationId,
        })
        .then(paymentMethod => this.registerInstance
          .submitPromiseCallbacks
          .resolve(paymentMethod))
        .catch(error => this.registerInstance
          .submitPromiseCallbacks
          .reject(error));
    }

    // transform response to an error structure similar to $http/$resource
    const error = {
      context: 'vantiv',
      status: responseCode,
      statusText: snakeCase(response.message).toUpperCase(),
      data: {
        message: response.message,
      },
    };

    return this.registerInstance.submitPromiseCallbacks.reject(error);
  }
}
