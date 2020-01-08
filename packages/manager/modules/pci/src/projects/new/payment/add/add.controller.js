export default class PciProjectsNewPaymentAddCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, ovhPaymentMethod) {
    // dependencies injections
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhPaymentMethod = ovhPaymentMethod;
  }

  /* =============================
  =            Events            =
  ============================== */

  onAvailablePaymentTypesLoadError() {
    return this.CucCloudMessage.error(
      this.$translate.instant('pci_projects_new_payment_add_load_error'),
    );
  }

  /* -----  End of Events  ------ */
}
