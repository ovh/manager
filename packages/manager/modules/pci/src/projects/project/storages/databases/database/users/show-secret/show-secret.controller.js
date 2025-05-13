export default class {
  /* @ngInject */
  constructor($translate, DatabaseService, CucControllerHelper) {
    this.$translate = $translate;
    this.service = DatabaseService;
    this.CucControllerHelper = CucControllerHelper;
  }

  $onInit() {
    this.isLoading = false;
    this.trackDashboard('users::show_secret', 'page');
  }

  downloadSecret() {
    this.trackDashboard(
      `users::show_secret::download_${this.secretType.label}`,
    );
    this.CucControllerHelper.constructor.downloadContent({
      fileContent: this.secretKeyAndAccess[this.secretType.label],
      fileName: this.secretType.filename,
    });
  }
}
