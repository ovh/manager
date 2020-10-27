export default class TelephonyPortabilitiesDeleteCtrl {
  /* @ngInject */
  constructor($translate, OvhApiTelephony) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteDocument() {
    this.isLoading = true;
    return this.OvhApiTelephony.Portability()
      .PortabilityDocument()
      .v6()
      .deleteDocument(
        {
          billingAccount: this.billingAccount,
          id: this.portabilityId,
        },
        {
          documentId: this.documentId,
        },
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant('portabilities_delete_document_succeed'),
        ),
      )
      .catch(() =>
        this.goBack(
          this.$translate.instant('portabilities_delete_document_failed'),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
