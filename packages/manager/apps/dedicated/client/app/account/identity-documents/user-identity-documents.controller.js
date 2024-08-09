import {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_TASK_TAG,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  KYC_ALLOWED_FILE_EXTENSIONS,
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
    if (!this.form.$invalid && this.isFileExtensionsValid()) {
      this.getUploadDocumentsLinks(this.files.length)
        .then(() => {
          this.loading = false;
          this.kycStatus.status = KYC_STATUS.OPEN;
          this.trackPage(TRACKING_TASK_TAG.uploadSuccess);
          this.handleInformationModal(true);
        })
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
    return this.$http
      .post(`/me/procedure/identity`, {
        numberOfDocuments: count,
      })
      .then(({ data: response }) => {
        const { uploadLinks } = response;
        return this.$q.all(
          uploadLinks.map((uploadLink, index) =>
            this.uploadDocumentsToS3usingLinks(uploadLink, this.files[index]),
          ),
        );
      })
      .then(() => {
        this.$http.post(`/me/procedure/identity/finalize`);
        this.showUploadOption = false;
      })
      .catch(() => {
        this.displayErrorBanner();
      });
  }

  uploadDocumentsToS3usingLinks(uploadLink, uploadedfile) {
    return this.$http
      .put(uploadLink.link, uploadedfile, {
        headers: { ...uploadLink.headers },
      })
      .catch(() => {
        this.displayErrorBanner();
      });
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
