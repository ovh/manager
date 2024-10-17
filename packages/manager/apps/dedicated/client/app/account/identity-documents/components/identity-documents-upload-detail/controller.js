import {
  PROOF_TYPE,
  PAGE_TYPE,
  MAX_SIZE,
  KYC_ALLOWED_FILE_EXTENSIONS,
} from '../../user-identity-documents.constant';

export default class AccountUserIdentityDocumentsUploadDetailController {
  /* @ngInject */
  constructor() {
    this.PROOF_TYPE = PROOF_TYPE;
    this.PAGE_TYPE = PAGE_TYPE;
    this.MAX_SIZE = MAX_SIZE;
    this.multipleFile = false;
    this.isValid = false;
    this.fileExtensionsValid = true;
  }

  $onInit() {
    this.numberOfDocuments = Object.keys(this.proof.documents)?.length;
    this.currentDocument = this.document;
    this.currentAcceptanceCriteria = this.proof.documents[
      this.currentDocument
    ].acceptance_criteria;
    this.resetFiles(this.documentFiles);
    this.checkValidity();
  }

  onDocumentChange() {
    this.currentAcceptanceCriteria = this.proof.documents[
      this.currentDocument
    ].acceptance_criteria;
    this.resetFiles();
    this.checkValidity();
  }

  resetFiles(documentFiles = []) {
    this.files = [];
    const numberOfFiles = this.proof.documents[this.currentDocument].quantity;
    for (let i = 0; i < numberOfFiles; i += 1) {
      if (documentFiles.length > i) {
        this.files.push([documentFiles[i]]);
      } else {
        this.files.push([]);
      }
    }
  }

  clickAddDocuments() {
    this.addDocuments({
      proofType: this.proofType,
      documentType: this.currentDocument,
      files: this.files.flatMap((file) => file),
    });
    this.goBack();
  }

  checkValidity() {
    const numberOfMandatoryDocuments = this.proof.documents[
      this.currentDocument
    ].mandatory;
    this.isFileExtensionsValid(this.files.flatMap((fileSlot) => fileSlot));
    let validMandatorySlots = 0;
    this.isValid =
      this.files.reduce((acc, fileSlot, index) => {
        const isNotMandatory = numberOfMandatoryDocuments <= index;
        const isSingle = fileSlot?.length === 1;
        const isNotInError = fileSlot[0]?.errors === undefined;
        const isFileSlotValid = (isSingle || isNotMandatory) && isNotInError;
        if (isFileSlotValid) validMandatorySlots += 1;
        return isFileSlotValid && acc;
      }, true) &&
      this.fileExtensionsValid &&
      validMandatorySlots >= numberOfMandatoryDocuments;
  }

  isFileExtensionsValid(files) {
    const badFileExtensionsList = [];
    this.fileExtensionsValid =
      !files ||
      files.reduce((acc, file) => {
        const {
          infos: { extension },
        } = file;
        const formatedExtension = extension.toLowerCase();
        const isExtensionIncluded = KYC_ALLOWED_FILE_EXTENSIONS.includes(
          formatedExtension,
        );
        if (!isExtensionIncluded) badFileExtensionsList.push(formatedExtension);
        return isExtensionIncluded && acc;
      }, true);
    this.badFileExtensionsFormatedList = badFileExtensionsList.join(', ');
  }
}
