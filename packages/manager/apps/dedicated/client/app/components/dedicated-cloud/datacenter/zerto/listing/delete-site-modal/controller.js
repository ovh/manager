export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    this.deleteSite()
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_drp_delete_site_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_drp_delete_site_error_banner',
          )} ${error.message}`,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
