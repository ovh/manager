import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default class PciProjectNewPaymentChooseCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.useNewPaymentMethod = false;
    this.myServiceUrl = coreConfig.isRegion(['EU', 'CA'])
      ? buildURL('dedicated', '#/billing/autoRenew')
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
