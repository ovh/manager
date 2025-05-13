import {
  // getBeneficiary,
  // isValid,
  // canUpload,
  // isPending,
  // getAvalaibleTypes,
  // findDocumentType,
  areAllDocumentsUploaded,
  formatDocuments,
} from './documents.constants';
import { buildEnumList } from '../../../sva-wallet.constants';

export default class KycIdentityDocumentsController {
  /* @ngInject */
  constructor($q, $translate) {
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.isLoading = true;

    this.documents = [];

    this.prepareDocuments(this.svaWallet.documents);
    this.isLoading = false;
  }

  prepareDocuments(documents) {
    this.documents = formatDocuments(this.svaWallet, documents, (types) =>
      buildEnumList(
        types,
        'telephony_billingAccount_svaWallet_kyc_documents_type_',
        this.$translate,
      ),
    );
    this.uploadsCompleted = areAllDocumentsUploaded(this.documents);
  }

  onDocumentChange(updatedDocument) {
    this.updateDocument(updatedDocument);
  }

  updateDocument(document) {
    const documentIndex = this.svaWallet.documents.findIndex(
      ({ id }) => id === document.id,
    );
    this.svaWallet.documents.splice(documentIndex, 1, document);
    this.prepareDocuments(this.svaWallet.documents);
  }
}
