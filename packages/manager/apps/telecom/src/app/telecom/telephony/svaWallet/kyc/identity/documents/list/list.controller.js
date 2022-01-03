import angular from 'angular';

import {
  buildEnumList,
  getEnumItemValue,
} from '../../../../sva-wallet.constants';

import uploadTemplate from '../document/upload/upload.html';
import uploadController from '../document/upload/upload.controller';

export default class DocumentsListController {
  /* @ngInject */
  constructor($attrs, $q, $translate, $uibModal) {
    this.$attrs = $attrs;
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.updateMode = false;
    if (angular.isDefined(this.$attrs.update) && this.$attrs.update === '') {
      this.updateMode = true;
    }

    this.documentTypes = buildEnumList(
      this.documentTypeEnum,
      'telephony_billingAccount_svaWallet_kyc_documents_type_',
      this.$translate,
    );

    this.documentNatures = buildEnumList(
      this.documentNatureEnum,
      'telephony_billingAccount_svaWallet_kyc_documents_nature_',
      this.$translate,
    );
  }

  upload(documentId) {
    const documentToUpload = this.documents.find(
      (document) => document.id === documentId,
    );

    const modalInstance = this.$uibModal.open({
      template: uploadTemplate,
      controller: uploadController,
      controllerAs: '$ctrl',
      resolve: {
        document: () => ({
          ...documentToUpload,
          type:
            (documentToUpload.selectedType &&
              getEnumItemValue(documentToUpload.selectedType)) ||
            documentToUpload.type,
        }),
        uploadDocument: () => (document, file) =>
          this.uploadDocument(document, file),
      },
    });
    return modalInstance.result
      .then((updatedDocument) => {
        this.onDocumentChange({ document: updatedDocument });
      })
      .catch(() => {
        // nothing to do
      });
  }
}
