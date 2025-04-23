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
import {
  DELAY_BETWEEN_RETRY,
  MAX_RETRIES,
} from '../../identity-documents/user-identity-documents.constant';

export default class KycDocumentsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $http,
    $timeout,
    coreConfig,
    atInternet,
    ExitGuardService,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
    this.$timeout = $timeout;
    this.ExitGuardService = ExitGuardService;
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
      this.ExitGuardService.activate();
      // Since we cannot initialize the procedure process multiple times, once
      // it is successful (e.g. we retrieved the upload links) we will skip
      // it in case of a user retry
      const promise = this.links
        ? this.tryToFinalizeProcedure(this.links)
        : this.initializeProcess(this.documents.length).then(
            ({ data: { uploadLinks } }) => {
              this.links = uploadLinks;
              return this.tryToFinalizeProcedure(uploadLinks);
            },
          );
      promise
        .then(() => {
          this.showUploadOption = false;
          this.loading = false;
          this.ExitGuardService.deactivate();
        })
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.documents = null;
      this.displayErrorBanner();
    }
  }

  initializeProcess(count, remainingRetries = MAX_RETRIES) {
    return this.getUploadDocumentsLinks(count).catch(() => {
      // In the case an error occurred during the upload links retrieval,
      // we will enter a retry loop
      if (remainingRetries > 0) {
        return this.$q((resolve, reject) => {
          this.$timeout(() => {
            this.initializeProcess(count, remainingRetries - 1)
              .then(resolve)
              .catch(reject);
          }, DELAY_BETWEEN_RETRY);
        });
      }
      this.atInternet.trackPage({ name: TRACKING.UPLOAD_ERROR });
      throw new Error('upload');
    });
  }

  getUploadDocumentsLinks(numberOfDocuments) {
    return this.$http.post(`/me/procedure/fraud`, {
      numberOfDocuments,
    });
  }

  tryToFinalizeProcedure(uploadLinks, remainingRetries = MAX_RETRIES) {
    return this.finalizeProcedure(uploadLinks).catch(async () => {
      // In the case an error occurred during the procedure finalization
      // (document upload and finalization request), we will enter a retry loop
      if (remainingRetries > 0) {
        return this.$q((resolve, reject) => {
          this.$timeout(() => {
            this.tryToFinalizeProcedure(uploadLinks, remainingRetries - 1)
              .then(resolve)
              .catch(reject);
          }, DELAY_BETWEEN_RETRY);
        });
      }
      return this.$q.reject();
    });
  }

  // The procedure finalization consist of documents upload and finalization
  // request
  finalizeProcedure(uploadLinks) {
    const flattenFiles = Object.values(this.documents).flatMap(
      ({ files }) => files,
    );

    return this.$q
      .all(
        uploadLinks.map((uploadLink, index) =>
          this.$http.put(uploadLink.link, flattenFiles[index], {
            headers: { ...uploadLink.headers },
          }),
        ),
      )
      .then(() => this.finalizeSubmit());
  }

  cancelSubmit() {
    this.trackClick(TRACKING.CTA_CANCEL);
    this.showModal = false;
    this.loading = false;
  }

  finalizeSubmit() {
    return this.$http.post(`/me/procedure/fraud/finalize`).then(() => {
      this.loading = false;
      this.documentsUploaded = true;
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
