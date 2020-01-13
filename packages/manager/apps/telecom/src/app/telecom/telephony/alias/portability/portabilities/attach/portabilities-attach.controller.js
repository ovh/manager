export default class TelephonyPortabilitiesAttachCtrl {
  /* @ngInject */
  constructor($q, $timeout, $translate, OvhApiTelephony) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.$timeout = $timeout;
    this.$q = $q;
  }

  $onInit() {
    this.isLoading = false;
    this.hasChecked = false;
    this.uploadedFile = [];
  }

  uploadFile() {
    this.isLoading = true;
    return this.OvhApiTelephony.Portability()
      .PortabilityDocument()
      .v6()
      .upload(
        this.billingAccount,
        this.portabilityId,
        this.uploadedFile[0].name,
        this.uploadedFile[0],
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('portabilities_attach_document_succeed'),
        ),
      )
      .catch(() =>
        this.goBack(
          this.$translate.instant('portabilities_attach_document_failed'),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
