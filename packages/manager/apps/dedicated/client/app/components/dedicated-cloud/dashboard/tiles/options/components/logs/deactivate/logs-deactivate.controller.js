angular.module('App').controller(
  'LogsDeactivateCtrl',
  class LogsDeactivateCtrl {
    /* @ngInject */
    constructor(
      $translate,
      $interval,
      $state,
      $uibModalInstance,
      Alerter,
      DedicatedCloud,
      data,
      logsService,
    ) {
      this.$translate = $translate;
      this.$interval = $interval;
      this.$state = $state;
      this.$uibModalInstance = $uibModalInstance;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
      this.data = data;
      this.$poll = null;
      this.logsService = logsService;
    }

    deactivateLogs() {
      this.loading = true;

      return this.logsService
        .disableLogForwarder(this.data.currentService.name)
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('logs_deactivate_success'),
            this.data.destinationId,
          );
        })
        .catch((error) => {
          this.Alerter.error(
            this.$translate.instant('logs_deactivate_error', {
              error: error.data?.message || error.message || error,
            }),
            this.data.destinationId,
          );
        })
        .finally(() => {
          this.loading = false;
          this.$uibModalInstance.dismiss();
        });
    }

    onCancel() {
      return this.goBack();
    }
  },
);
