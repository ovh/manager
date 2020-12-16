import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend';

export default class PciProjectNewPaymentChooseCtrl {
  /* @ngInject */
  constructor() {
    this.useNewPaymentMethod = false;
    this.myServiceUrl = ['EU', 'CA'].includes(Environment.getRegion())
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
