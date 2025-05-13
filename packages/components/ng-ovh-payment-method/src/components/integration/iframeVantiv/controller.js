import { get, merge, snakeCase } from 'lodash-es';

import { VANTIV_IFRAME_CONFIGURATION, VANTIV_RESPONSE_CODE } from './constants';

export default class OvhPaymentMethodRegisterIframeVantivCtrl {
  /* @ngInject */
  constructor() {
    // other attributes
    this.eProtectClient = null; // instanciated in render method
    this.integrationInstance = null;
  }

  /**
   *  Init the controller for Vantiv Iframe management.
   *  This mean that Vantiv script has been loaded and is ready to be used.
   *  As $onInit is potentially called before the loading of the Vantiv script,
   *  we declare an init method that will be called in directive's link function
   *  when script is loaded.
   *  Will trigger the onInitialized callback of integration directive.
   */
  init() {
    // call onIntegrationInitialized callback from parent controller to get render options
    const renderOptions = this.integrationCtrl.onIntegrationInitialized(
      this.submit.bind(this),
    );

    // render the Iframe
    this.render(renderOptions);
  }

  /**
   *  Render Vantiv Iframe content
   */
  render(renderOptions = {}) {
    this.eProtectClient = new EprotectIframeClient(
      merge(
        {
          callback: this.onIframeSubmitted.bind(this),
        },
        VANTIV_IFRAME_CONFIGURATION,
        renderOptions,
      ),
    );
  }

  /**
   *  Submit the Vantiv iframe form content.
   *  This will call getPaypageRegistrationId of the EprotectIframeClient
   *  that will trigger the callback function configured when instanciating the eProtectClient.
   *  @return {Promise}
   */
  submit() {
    return this.integrationCtrl
      .onIntegrationSubmit()
      .then(this.insertThreatMetrix.bind(this))
      .then(() => {
        // validate the information in Vantiv iframe
        this.eProtectClient.getPaypageRegistrationId({
          id: `PM${this.integrationCtrl.paymentValidation.paymentMethodId}`,
        });
      })
      .catch(() => {});
  }

  onIframeSubmitted(response) {
    const responseCode = parseInt(get(response, 'response', '-1'), 10);

    if (responseCode === VANTIV_RESPONSE_CODE.SUCCESS) {
      // finalize the payment registration
      // then remove ThreatMetrix script and iframe (defined in directive's link function)
      return this.integrationCtrl.onIntegrationFinalize({
        expirationMonth: parseInt(response.expMonth, 10),
        expirationYear: parseInt(response.expYear, 10),
        registrationId: response.paypageRegistrationId,
      });
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

    return this.integrationCtrl.manageCallback('onSubmitError', { error });
  }
}
