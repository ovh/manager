import { formatDocuments } from '../documents/documents.constants';
import { buildEnumList } from '../../../sva-wallet.constants';

export default class KycIdentitySummaryController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.showDocumentSuccessMessage = false;
    this.updateIbanSuccessMessage = false;
    this.prepareDocuments(this.svaWallet.documents);
  }

  prepareDocuments(documents) {
    this.documents = formatDocuments(this.svaWallet, documents, (types) =>
      buildEnumList(
        types,
        'telephony_billingAccount_svaWallet_kyc_documents_type_',
        this.$translate,
      ),
    );
  }

  onDocumentChange(updatedDocument) {
    this.updateDocument(updatedDocument);
  }

  updateDocument(document) {
    this.showDocumentSuccessMessage = true;
    const documentIndex = this.svaWallet.documents.findIndex(
      ({ id }) => id === document.id,
    );
    this.svaWallet.documents.splice(documentIndex, 1, document);
    this.prepareDocuments(this.svaWallet.documents);
  }
}
