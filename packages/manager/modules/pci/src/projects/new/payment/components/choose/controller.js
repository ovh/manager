export default class PciProjectNewPaymentChooseCtrl {
  /* @ngInject */
  constructor(RedirectionService) {
    this.useNewPaymentMethod = false;
    this.myServiceUrl = RedirectionService.getURL('services');
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
