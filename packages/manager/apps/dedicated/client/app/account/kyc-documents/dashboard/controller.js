import { FRAUD_STATUS } from '../constants';
import { DOCUMENT_TYPE, DOCUMENT_LIST, MAXIMUM_SIZE } from './constants';

export default class KycDocumentsCtrl {
  /* @ngInject */
  constructor($translate, coreURLBuilder) {
    this.$translate = $translate;
    this.maximum_size = MAXIMUM_SIZE;
    this.DOCUMENT_TYPE = DOCUMENT_TYPE;
    this.coreURLBuilder = coreURLBuilder;
    this.FRAUD_STATUS = FRAUD_STATUS;
  }

  $onInit() {
    // init uploaded documents list
    this.documents = [];

    // personnalcorporation user is like corporation user
    if (this.user.legalform === 'personalcorporation')
      this.user.legalform = 'corporation';

    this.supportLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/support/tickets',
    );

    // retrieve mandatory / optionnal documents
    this.getDocumentList();
  }

  getDocumentList() {
    const documentTypeList = DOCUMENT_LIST[this.user.legalform];
    const documentList = [];
    documentTypeList.forEach((documentType, index) => {
      const key =
        documentType !== this.DOCUMENT_TYPE.OTHER
          ? `documents_dashboard_document_${documentType}`
          : `documents_dashboard_document_${this.user.legalform}_${documentType}`;
      this.$translate(`${key}_${this.user.ovhSubsidiary}`).then(
        (translation) => {
          documentList[index] =
            translation !== `${key}_${this.user.ovhSubsidiary}`
              ? translation
              : this.$translate.instant(`${key}_DEFAULT`);
          this.documentList = documentList;
        },
      );
    });
  }

  uploadDocuments() {
    // TODO: Upload document in next ticket
    this.loading = true;
  }
}
