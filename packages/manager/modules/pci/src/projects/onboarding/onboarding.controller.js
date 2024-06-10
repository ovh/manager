import illustration from './assets/onboarding.png';
import illustrationUs from './assets/onboarding-us.png';

export default class {
  /* @ngInject */
  constructor(
    $q,
    orderCart,
    pciProjectNew,
    atInternet,
    coreConfig,
    coreURLBuilder,
  ) {
    this.illustration = illustration;
    this.illustrationUs = illustrationUs;
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: 'PublicCloud::pci::projects::onboarding',
    });

    this.myIdentitySectionLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/support/tickets',
    );
    this.isItSubsidiary = this.coreConfig.getUser().ovhSubsidiary === 'IT';
  }

  isKycValidationUnderVerification() {
    const { kycValidated, ovhSubsidiary } = this.coreConfig.getUser();
    return !kycValidated && ovhSubsidiary === 'IN';
  }

  isProjectCreationButtonDisabled() {
    if (this.isItSubsidiary) {
      return (
        !this.model.agreements || !this.model.italyAgreement || this.isLoading
      );
    }
    return !this.model.agreements || this.isLoading;
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
