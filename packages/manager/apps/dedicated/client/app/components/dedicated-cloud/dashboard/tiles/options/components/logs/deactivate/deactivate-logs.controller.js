export default class LogsDeactivateCtrl {
  /* @ngInject */
  constructor($translate, Alerter, logsService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.logsService = logsService;
  }

  deactivateLogs() {
    this.loading = true;

    return this.logsService
      .disableLogForwarder(this.productId)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('logs_deactivate_success'),
          'dedicatedCloud',
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('logs_deactivate_error', {
            error: error.data?.message || error.message || error,
          }),
          'dedicatedCloud',
        );
      })
      .finally(() => {
        this.loading = false;
        this.goBack();
      });
  }
}
