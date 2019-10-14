import get from 'lodash/get';
import merge from 'lodash/merge';

export default class OvhPaymentMethodIntegrationInContextPaypalCtrl {
  /* @ngInject */
  constructor(TranslateService) {
    this.TranslateService = TranslateService;
  }

  /**
   *  Initialization method.
   *  Call this method when paypal checkout.js script is loaded.
   *  This method will then call the onInitialized callback of integration directive.
   */
  init() {
    // call onIntegrationInitialized callback from parent controller to get render options
    const renderOptions = merge({
      locale: this.TranslateService.getUserLocale(),
    }, this.inContextCtrl.integrationCtrl.onIntegrationInitialized());

    this.render(renderOptions); // defined in directive's link function
  }

  /**
   *  onAuthorize callback needed for Payapl button.
   *  This will call POST /me/paymentMethod/{paymentMethodId}/finalize API.
   *  @return {Promise}
   */
  onAuthorize() {
    const finalizeData = {
      formSessionId: get(this, 'inContextCtrl.integrationCtrl.paymentValidation.formSessionId'),
    };

    return this.inContextCtrl
      .integrationCtrl
      .onIntegrationFinalize(finalizeData);
  }

  submit() {
    return this.inContextCtrl
      .integrationCtrl
      .onIntegrationSubmit()
      .then(({ formSessionId }) => formSessionId);
  }
}
