import updateBankAccountTemplate from './updateBankAccount/update-bank-account.html';
import updateBankAccountController from './updateBankAccount/update-bank-account.controller';
import { formatDocuments } from '../documents/documents.constants';
import { buildEnumList } from '../../../sva-wallet.constants';

export default class KycIdentitySummaryController {
  /* @ngInject */
  constructor($q, $translate, $uibModal, ovhPaymentMethodHelper) {
    this.$q = $q;
    this.$translate = $translate;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.showDocumentSuccessMessage = false;
    this.showIBANSuccessMessage = false;
    this.prepareDocuments(this.svaWallet.documents);
  }

  updateBankAccount() {
    this.showIBANSuccessMessage = false;
    const modalInstance = this.$uibModal.open({
      template: updateBankAccountTemplate,
      controller: updateBankAccountController,
      controllerAs: '$ctrl',
      resolve: {
        bankAccount: () => this.bankAccount,
        updateBankAccount: () => (bankAccount) =>
          this.saveWalletIban(bankAccount),
      },
    });
    return modalInstance.result
      .then(() => {
        this.showIBANSuccessMessage = true;
      })
      .catch(() => {
        // nothing to do
      });
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
