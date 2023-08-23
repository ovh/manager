import { DOCUMENT_TYPE, DOCUMENT_LIST } from './constants';

export default class KycDocumentsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DOCUMENT_TYPE = DOCUMENT_TYPE;
  }

  $onInit() {
    // personnalcorporation user is like corporation user
    if (this.user.legalform === 'personalcorporation')
      this.user.legalform = 'corporation';

    // retrieve mandatory / optionnal documents
    this.getDocumentList();
  }

  getDocumentList() {
    this.documentList = DOCUMENT_LIST[this.user.legalform];
  }
}
