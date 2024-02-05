import illustration from './assets/onboarding.png';
import illustrationUs from './assets/onboarding-us.png';

export default class {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew, atInternet) {
    this.illustration = illustration;
    this.illustrationUs = illustrationUs;
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: 'PublicCloud::pci::projects::onboarding',
    });
  }

  onCreateDiscoveryProjectClick() {
    this.isLoading = true;
    this.atInternet.trackClick({
      name: 'PCI_PROJECTS_ONBOARDING_NEW_PROJECT',
      type: 'action',
    });
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
