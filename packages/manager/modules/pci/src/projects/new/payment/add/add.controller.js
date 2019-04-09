import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';

export default class PciProjectsNewPaymentAddCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod) {
    // dependencies injections
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.paymentTypesChunk = {
      size: 3,
      chunks: null,
    };

    this.model = {
      selectedPaymentMethodType: null,
    };
  }

  /* =============================
  =            Events            =
  ============================== */

  onPaymentMethodChange() {
    console.log(this.model.selectedPaymentMethodType);
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    const paymentTypes = sortBy(this.paymentTypes, 'paymentType.text');
    this.paymentTypesChunk.chunks = chunk(paymentTypes, this.paymentTypesChunk.size);
  }

  /* -----  End of Initialization  ------ */
}
