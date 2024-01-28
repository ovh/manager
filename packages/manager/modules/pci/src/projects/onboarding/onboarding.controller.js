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
}
