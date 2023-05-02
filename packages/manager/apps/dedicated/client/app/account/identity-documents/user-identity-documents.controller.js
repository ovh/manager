import { USER_TYPE, MAX_SIZE } from './user-identity-documents.constant';

export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor($q, $http, coreConfig, coreURLBuilder) {
    this.$q = $q;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.user_type = USER_TYPE;
    this.maximum_size = MAX_SIZE;
  }

  $onInit() {
    this.currentUser = this.coreConfig.getUser().legalform;
    this.files = [];
    this.loading = false;
    this.showUploadOption = true;
    this.displayError = false;
    this.dashboardRedirectURL = this.coreURLBuilder.buildURL('hub', '');
  }

  uploadIdentityDocuments() {
    this.loading = true;
    this.displayError = false;
    if (!this.form.$invalid) {
      this.getUploadDocumentsLinks(this.files.length)
        .then(() => {
          this.loading = false;
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
  }
}
