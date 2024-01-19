import { get, merge } from 'lodash-es';

export default class OvhPaymentMethodIntegrationInContextPaypalCtrl {
  /* @ngInject */
  constructor($scope, $timeout, ovhPaymentMethod) {
    this.$timeout = $timeout;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.buttonsCtrl = null;

    $scope.$watch(
      () => this.inContextCtrl.integrationCtrl.disabled,
      (isIntegrationDisabled) => {
        this.disabled = isIntegrationDisabled;
        if (this.disabled) this.disableButtons();
        else this.enableButtons();
      },
    );
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

  onButtonsInit(_, buttonsCtrl) {
    this.buttonsCtrl = buttonsCtrl;
    if (this.inContextCtrl.integrationCtrl.disabled) {
      this.disableButtons();
    }
  }

  disableButtons() {
    if (this.buttonsCtrl) {
      this.buttonsCtrl.disable();
    }
  }

  enableButtons() {
    if (this.buttonsCtrl) {
      this.buttonsCtrl.enable();
    }
  }
}
