import { FRAUD_STATUS } from '../constants';
import { DOCUMENT_TYPE, DOCUMENT_LIST, MAXIMUM_SIZE } from './constants';

export default class KycDocumentsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DOCUMENT_TYPE = DOCUMENT_TYPE;
    this.maximum_size = MAXIMUM_SIZE;
  }

  $onInit() {
    this.loading = false;

    // init uploaded documents list
    this.documents = [];

    // personnalcorporation user is like corporation user
    if (this.user.legalform === 'personalcorporation')
      this.user.legalform = 'corporation';

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
    this.loading = true;
    if (!this.form.$invalid) {
      this.getUploadDocumentsLinks(this.documents.length)
        .then(() => {
          this.loading = false;
          this.resource.status = FRAUD_STATUS.OPEN;
        })
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.documents = null;
      this.displayErrorBanner();
    }
  }

  getUploadDocumentsLinks(count) {
    return this.$http
      .post(`/me/procedure/fraud`, {
        numberOfDocuments: count,
      })
      .then(({ data: response }) => {
        const { uploadLinks } = response;
        return this.$q.all(
          uploadLinks.map((uploadLink, index) =>
            this.uploadDocumentsToS3usingLinks(
              uploadLink,
              this.documents[index],
            ),
          ),
        );
      })
      .then(() => {
        this.$http.post(`/me/procedure/fraud/finalize`);
      })
      .catch(() => {
        this.displayErrorBanner();
      });
  }

  uploadDocumentsToS3usingLinks(uploadLink, uploadedfile) {
    return this.$http
      .post(uploadLink.link, uploadedfile, {
        headers: { ...uploadLink.headers },
      })
      .catch(() => {
        this.displayErrorBanner();
      });
  }
}
