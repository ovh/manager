import { FRAUD_STATUS } from '../constants';
import {
  DOCUMENT_TYPE,
  DOCUMENT_LIST,
  MAXIMUM_SIZE,
  LEGAL_FORMS,
  MAXIMUM_DOCUMENTS,
  PRIVACY_LINKS,
  TRACKING,
} from './constants';

import illustration from './assets/picto.svg';

export default class KycDocumentsCtrl {
  /* @ngInject */
  constructor($translate, $q, $http, coreConfig, atInternet) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
    this.maximum_size = MAXIMUM_SIZE;
    this.DOCUMENT_TYPE = DOCUMENT_TYPE;
    this.maximum_documents = MAXIMUM_DOCUMENTS;
    this.FRAUD_STATUS = FRAUD_STATUS;
    this.TRACKING = TRACKING;
    this.illustration = illustration;
    this.privacyLink =
      PRIVACY_LINKS[coreConfig.getUser().ovhSubsidiary] ||
      PRIVACY_LINKS.DEFAULT;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loading = false;
    this.showModal = false;
    this.documentsUploaded = false;
    this.maximum_size_mo = this.maximum_size / 10 ** 6;

    // init uploaded documents list
    this.documents = [];

    // personnalcorporation user is like corporation user
    if (this.user.legalform === LEGAL_FORMS.PERSONALCORPORATION)
      this.user.legalform = LEGAL_FORMS.CORPORATION;
    // other user is like individual user
    if (this.user.legalform === LEGAL_FORMS.OTHER)
      this.user.legalform = LEGAL_FORMS.INDIVIDUAL;

    // retrieve mandatory / optionnal documents
    this.getDocumentList();
  }

  getDocumentList() {
    const documentTypeList = DOCUMENT_LIST[this.user.legalform];
    const documentList = {
      mandatory: [],
      optional: [],
    };
    Object.keys(documentTypeList).forEach((type) => {
      documentTypeList[type].forEach((documentType, index) => {
        const key =
          documentType !== this.DOCUMENT_TYPE.OTHER
            ? `documents_dashboard_document_${documentType}`
            : `documents_dashboard_document_${this.user.legalform}_${documentType}`;
        this.$translate(`${key}_${this.user.ovhSubsidiary}`).then(
          (translation) => {
            documentList[type][index] =
              translation !== `${key}_${this.user.ovhSubsidiary}`
                ? translation
                : this.$translate.instant(`${key}_DEFAULT`);
            this.documentList = documentList;
          },
        );
      });
    });
  }

  uploadDocuments() {
    this.trackClick(TRACKING.CTA_CONFIRM);
    this.loading = true;
    this.showModal = false;
    if (!this.form.$invalid) {
      this.getUploadDocumentsLinks(this.documents.length)
        .then(() => {
          this.atInternet.trackPage({ name: TRACKING.UPLOAD_SUCCESS });
          this.finalizeSubmit();
        })
        .catch(() => {
          this.atInternet.trackPage({ name: TRACKING.UPLOAD_ERROR });
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
      .catch(() => {
        this.displayErrorBanner();
        throw new Error('upload');
      });
  }

  uploadDocumentsToS3usingLinks(uploadLink, uploadedfile) {
    return this.$http({
      method: uploadLink.method,
      url: uploadLink.link,
      data: uploadedfile,
      headers: { ...uploadLink.headers },
    }).catch(() => {
      this.displayErrorBanner();
      throw new Error('upload');
    });
  }

  cancelSubmit() {
    this.trackClick(TRACKING.CTA_CANCEL);
    this.showModal = false;
    this.loading = false;
  }

  finalizeSubmit() {
    this.$http
      .post(`/me/procedure/fraud/finalize`)
      .then(() => {
        this.loading = false;
        this.documentsUploaded = true;
      })
      .catch(() => {
        this.displayErrorBanner();
      });
  }

  displayErrorBanner() {
    this.loading = false;
    this.displayError = true;
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }

  sendDocumentClick() {
    this.showModal = true;
    this.trackClick(TRACKING.CTA_SEND_DOCUMENTS);
  }
}
