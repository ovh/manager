export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        'autorenew_hosting_dashboard_close_service_success',
      ),
    );
  }

  onError(error) {
    this.goBack(
      `${this.$translate.instant(
        'autorenew_hosting_dashboard_close_service_error',
      )} ${error?.data?.message}`,
      'danger',
    );
  }
}
