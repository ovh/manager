import {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_TASK_TAG,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  KYC_ALLOWED_FILE_EXTENSIONS,
  DELAY_BETWEEN_RETRY,
  MAX_RETRIES,
} from './user-identity-documents.constant';

export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor($q, $http, $scope, coreConfig, coreURLBuilder, atInternet) {
    this.$q = $q;
    this.$http = $http;
    this.$scope = $scope;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.maximum_size = MAX_SIZE;
    this.fileExtensionsValid = true;
    this.atInternet = atInternet;
    this.LEGAL_LINK1 = LEGAL_LINK1;
    this.LEGAL_LINK2 = LEGAL_LINK2;
    this.LEGAL_LINK3 =
      LEGAL_LINK3[coreConfig.getUser().ovhSubsidiary] || LEGAL_LINK3.OTHERS;
    this.KYC_STATUS = KYC_STATUS;
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;
    this.USER_TYPE = USER_TYPE;
  }

  $onInit() {
    this.currentUser = this.coreConfig.getUser().legalform;
    this.files = [];
    this.links = null;
    this.loading = false;
    this.showUploadOption = true;
    this.displayError = false;
    this.isOpenModal = false;
    this.isOpenInformationModal = false;
    this.dashboardRedirectURL = this.coreURLBuilder.buildURL('hub', '');
    this.user_type = USER_TYPE[this.currentUser]
      ? USER_TYPE[this.currentUser]
      : USER_TYPE.default;

    this.$scope.$watchCollection('$ctrl.files', () => {
      this.isFileExtensionsValid();
    });
  }

  uploadIdentityDocuments() {
    this.handleUploadConfirmModal(false);
    this.loading = true;
    this.displayError = false;
    this.trackClick(TRACKING_TASK_TAG.upload);
    // We should mutualize this, as we should have the same behavior for KYC Fraud: MANAGER-15202
    if (!this.form.$invalid && this.isFileExtensionsValid()) {
      const promise = this.links
        ? // We cannot re call getUploadDocumentsLinks if it answered successfully, so if we already
          // retrieve the links we directly try to "finalize" the procedure
          this.tryToFinalizeProcedure(this.links)
        : // In order to start the KYC procedure we need to request the upload links for the number of documents
          // the user wants to upload
          this.getUploadDocumentsLinks(this.files.length)
            // Once we retrieved the upload links, we'll try to upload them and then "finalize" the procedure creation
            .then(({ data: { uploadLinks } }) => {
              this.links = uploadLinks;
              return this.tryToFinalizeProcedure(uploadLinks);
            });
      promise
        .then(() => {
          this.showUploadOption = false;
          this.loading = false;
          this.kycStatus.status = KYC_STATUS.OPEN;
          this.trackPage(TRACKING_TASK_TAG.uploadSuccess);
          this.handleInformationModal(true);
        })
        // In case of any error, we display a banner to the user to inform them
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.files = null;
      this.displayErrorBanner();
    }
  }

  handleUploadConfirmModal(open) {
    this.isOpenModal = open;
  }

  handleInformationModal(open) {
    this.isOpenInformationModal = open;
  }

  getUploadDocumentsLinks(count) {
    return this.$http.post(`/me/procedure/identity`, {
      numberOfDocuments: count,
    });
  }

  // In order to avoid false positive from file upload endpoint, we'll retry all the process from the start
  tryToFinalizeProcedure(uploadLinks) {
    let remainingRetries = MAX_RETRIES;
    // First we try to upload the file using the retrieved link
    return (
      this.finalizeProcedure(uploadLinks)
        // In case of any error, we'll retry until we hit some maximum retry amount
        .catch(async () => {
          let success = false;
          // As we need to retry until the task in is success, or we exceed the max retry count, the following await
          // in a loop is valid, so we'll ignore eslint on the following loop
          while (!success && remainingRetries) {
            /* eslint-disable no-await-in-loop */
            await new Promise((resolve) => {
              setTimeout(resolve, DELAY_BETWEEN_RETRY);
            });
            try {
              /* eslint-disable no-await-in-loop */
              await this.finalizeProcedure(uploadLinks);
              success = true;
            } catch (error) {
              remainingRetries -= 1;
            }
          }
          return success ? this.$q.resolve() : this.$q.reject();
        })
    );
  }

  finalizeProcedure(uploadLinks) {
    return (
      this.$q
        .all(
          uploadLinks.map((uploadLink, index) =>
            this.$http.put(uploadLink.link, this.files[index], {
              headers: { ...uploadLink.headers },
            }),
          ),
        )
        // If all goes well, we'll ask for the "finalization" of the procedure creation
        .then(() => this.$http.post(`/me/procedure/identity/finalize`))
    );
  }

  isFileExtensionsValid() {
    const badFileExtensionsList = [];
    this.fileExtensionsValid = this.files.reduce(
      (acc, { infos: { extension } }) => {
        const formatedExtension = extension.toLowerCase();
        const isExtensionIncluded = KYC_ALLOWED_FILE_EXTENSIONS.includes(
          formatedExtension,
        );
        if (!isExtensionIncluded) badFileExtensionsList.push(formatedExtension);
        return isExtensionIncluded && acc;
      },
      true,
    );
    this.badFileExtensionsFormatedList = badFileExtensionsList.join(', ');
    return this.fileExtensionsValid;
  }

  displayErrorBanner() {
    this.loading = false;
    this.displayError = true;
    this.trackPage(TRACKING_TASK_TAG.uploadError);
  }

  trackClick(hit, type = 'action') {
    this.atInternet.trackClick({
      name: hit,
      type,
    });
  }

  trackPage(hit) {
    this.atInternet.trackPage({
      name: hit,
    });
  }
}
