import illustration from './assets/onboarding.png';
import illustrationUs from './assets/onboarding-us.png';

export default class {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew) {
    this.illustration = illustration;
    this.illustrationUs = illustrationUs;
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
  }

  onCreateDiscoveryProjectClick() {
    this.isLoading = true;
    return this.pciProjectNew
      .finalizeCart(this.cart)
      .then((order) => {
        if (order?.orderId) {
          return this.onCartFinalized(order, true);
        }
        return null;
      })
      .catch(() => {
        this.componentInitialParams = null;
        this.hasComponentRedirectCallback = false;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Waiting for specification to clarify the behaviour of the HDS component
  setHdsOptionItem() {
    const { cartId, projectItem, hdsItem } = this.cart;
    const { hds: hdsIsChecked } = this.model;
    if (this.hds.isValidSupportLevel) {
      if (hdsIsChecked && !hdsItem) {
        const priceMode = this.hds.option.prices.find(({ capacities }) =>
          capacities.includes('renew'),
        );
        return this.orderCart
          .addNewOptionToProject(cartId, {
            duration: priceMode.duration,
            itemId: projectItem.itemId, // Add HDS option to project
            planCode: this.hds.option.planCode,
            pricingMode: priceMode.pricingMode,
            quantity: 1,
          })
          .then((option) => this.cart.addItem(option));
      }
      if (!hdsIsChecked && hdsItem) {
        return this.orderCart
          .deleteItem(cartId, hdsItem.itemId)
          .then(() => this.cart.deleteItem(hdsItem));
      }
    }
    return this.$q.when();
  }

  onHdsCheckboxChanged(hdsCheckbox) {
    this.model.hds = hdsCheckbox.status;
    this.hds.isInprogressRequest = true;
    this.setHdsOptionItem()
      .then(() => this.getSummary())
      .then((summary) => {
        this.summary = summary;
      })
      .catch(() => {
        this.model.hds = false;
      })
      .finally(() => {
        this.hds.isInprogressRequest = false;
      });
  }
}
