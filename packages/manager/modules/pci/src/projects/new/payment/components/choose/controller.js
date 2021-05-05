export default class PciProjectNewPaymentChooseCtrl {
  /* @ngInject */
  constructor(coreConfig, coreURLBuilder) {
    this.useNewPaymentMethod = false;
    this.myServiceUrl = coreConfig.isRegion(['EU', 'CA'])
      ? coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew')
      : '';
  }

  /*= =============================
  =            Events            =
  ============================== */

  onUseNewPaymentMethodBtnClick() {
    this.useNewPaymentMethod = !this.useNewPaymentMethod;
  }

  onChooseDefaultPaymentMethodChange() {
    this.useNewPaymentMethod = false;
    this.model.paymentMethod = null;
  }

  /*= ====  End of Events  ====== */
}
