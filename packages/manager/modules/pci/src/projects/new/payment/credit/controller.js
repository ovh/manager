export default class PciProjectsNewPaymentCreditCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, pciProjectNew) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.pciProjectNew = pciProjectNew;
  }

  onCreditBtnClick() {
    this.globalLoading.finalize = true;

    if (this.viewOptions.onCreditBtnClick) {
      return this.viewOptions.onCreditBtnClick();
    }

    return this.pciProjectNew
      .finalizeCart(this.cart)
      .then((order) => this.onCartFinalized(order))
      .catch(() => {
        this.trackProjectCreationError(
          'payment',
          'pci_project_new_payment_credit_checkout_error',
        );
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_project_new_payment_credit_checkout_error',
          ),
          'pci.projects.new.payment',
        );
      })
      .finally(() => {
        this.globalLoading.finalize = false;
      });
  }
}
