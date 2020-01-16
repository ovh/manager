import map from 'lodash/map';
import template from 'lodash/template';

export default class PciProjectNewConfigCtrl {
  /* @ngInject */
  constructor(pciProjectNew) {
    this.pciProjectNew = pciProjectNew;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  getCompiledLinks(linkTemplate) {
    return map(this.checkout.contracts, (contract) => {
      const compile = template(linkTemplate);
      return compile(contract);
    }).join(', ');
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onProjectConfigFormSubmit() {
    let setDescrPromise = Promise.resolve(true);

    if (this.model.description && !this.cart.projectItem.descriptionConfiguration) {
      setDescrPromise = this.pciProjectNew.setCartProjectItemDescription(
        this.cart,
        this.model.description,
      );
    }

    return setDescrPromise
      .then(() => this.goToPayment());
  }

  /* -----  End of Events  ------ */
}
