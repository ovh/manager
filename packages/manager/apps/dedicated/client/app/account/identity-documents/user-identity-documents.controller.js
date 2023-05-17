import {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
} from './user-identity-documents.constant';

export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor($q, $http, coreConfig, coreURLBuilder, atInternet) {
    this.$q = $q;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.user_type = USER_TYPE;
    this.maximum_size = MAX_SIZE;
    this.atInternet = atInternet;
    this.LEGAL_LINK1 = LEGAL_LINK1;
    this.LEGAL_LINK2 = LEGAL_LINK2;
    this.LEGAL_LINK3 =
      LEGAL_LINK3[coreConfig.getUser().ovhSubsidiary] || LEGAL_LINK3.OTHERS;
  }

  $onInit() {
    this.currentUser = this.coreConfig.getUser().legalform;
    this.files = [];
    this.loading = false;
    this.showUploadOption = true;
    this.displayError = false;
    this.dashboardRedirectURL = this.coreURLBuilder.buildURL('hub', '');
    this.trackPage(TRACKING_PREFIX);
  }

  uploadIdentityDocuments() {
    this.loading = true;
    this.displayError = false;
    this.trackClick(TRACKING_TASK_TAG.upload);
    if (!this.form.$invalid) {
      this.getUploadDocumentsLinks(this.files.length)
        .then(() => {
          this.loading = false;
          this.trackPage(TRACKING_TASK_TAG.uploadSuccess);
        })
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.files = null;
      this.displayErrorBanner();
    }
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
