export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goToAutorenew(
      this.skipRetentionPeriod
        ? this.$translate.instant(
            'autorenew_hosting_dashboard_close_service_success_skip_retention_period',
          )
        : this.$translate.instant(
            'autorenew_hosting_dashboard_close_service_success',
          ),
      'success',
      true,
    );
  }

  onError(error) {
    this.goToAutorenew(
      `${this.$translate.instant(
        'autorenew_hosting_dashboard_close_service_error',
      )} ${error?.data?.message}`,
      'danger',
    );
  }
}
