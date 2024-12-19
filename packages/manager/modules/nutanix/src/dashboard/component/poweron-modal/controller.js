export default class {
  /* @ngInject */
  constructor($window, $translate) {
    this.$translate = $translate;
    this.$window = $window;
    this.loading = false;
  }

  onSubmit() {
    this.loading = true;
    this.poweronNode()
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_poweron_node_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'nutanix_dashboard_poweron_node_error_banner',
          )} ${error.message}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
