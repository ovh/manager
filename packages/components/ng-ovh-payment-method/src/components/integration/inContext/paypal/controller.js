import { get, merge } from 'lodash-es';

export default class OvhPaymentMethodIntegrationInContextPaypalCtrl {
  /* @ngInject */
  constructor($timeout, ovhPaymentMethod) {
    this.$timeout = $timeout;
    this.ovhPaymentMethod = ovhPaymentMethod;
  }

  /**
   *  Initialization method.
   *  Call this method when paypal checkout.js script is loaded.
   *  This method will then call the onInitialized callback of integration directive.
   */
  init() {
    // call onIntegrationInitialized callback from parent controller to get render options
    const renderOptions = merge(
      {
        locale: this.ovhPaymentMethod.getUserLocale(),
      },
      this.inContextCtrl.integrationCtrl.onIntegrationInitialized(),
    );

    this.render(renderOptions); // defined in directive's link function
  }

  /**
   *  onAuthorize callback needed for Payapl button.
   *  This will call POST /me/paymentMethod/{paymentMethodId}/finalize API.
   *  @return {Promise}
   */
  onAuthorize() {
    const finalizeData = {
      formSessionId: get(
        this,
        'inContextCtrl.integrationCtrl.paymentValidation.formSessionId',
      ),
    };

    return this.$timeout(() =>
      this.inContextCtrl.integrationCtrl.onIntegrationFinalize(finalizeData),
    );
  }

  submit() {
    return this.inContextCtrl.integrationCtrl
      .onIntegrationSubmit()
      .then(({ formSessionId }) => formSessionId)
      .catch(() => {});
  }
}
