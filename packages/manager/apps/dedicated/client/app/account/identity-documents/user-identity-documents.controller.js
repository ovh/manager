import {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
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
            this.uploadDocumenstToS3usingLinks(uploadLink, this.files[index]),
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

  uploadDocumenstToS3usingLinks(uploadLink, uploadedfile) {
    this.$http.put(uploadLink.link, uploadedfile, {
      headers: { ...uploadLink.headers },
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
