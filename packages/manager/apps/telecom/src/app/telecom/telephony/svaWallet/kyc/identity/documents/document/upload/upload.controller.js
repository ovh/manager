export default class KycIdentityDocumentsDocumentUploadController {
  /* @ngInject */
  constructor($uibModalInstance, $translate, document, uploadDocument) {
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.document = document;
    this.uploadDocument = uploadDocument;
    this.isLoading = false;
  }

  confirm() {
    this.errorMessage = undefined;
    if (!this.form.$invalid) {
      this.isLoading = true;
      this.uploadDocument(this.document, this.file[0])
        .then((documentUpdated) => {
          this.$uibModalInstance.close(documentUpdated);
        })
        .catch((error) => {
          // display error
          this.errorMessage = error.message;
          this.isLoading = false;
        });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
