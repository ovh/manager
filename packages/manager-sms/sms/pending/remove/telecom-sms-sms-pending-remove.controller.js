angular.module('managerApp').controller('TelecomSmsSmsPendingRemoveCtrl', class TelecomSmsSmsPendingRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, pendingSms) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        jobs: OvhApiSms.Jobs().v6(),
      },
    };
    this.pendingSms = pendingSms;
  }

  $onInit() {
    this.loading = {
      removePending: false,
    };
    this.removed = false;
    this.model = {
      pendingSms: angular.copy(this.pendingSms),
    };
  }

  /**
     * Remove pending sms.
     * @return {Promise}
     */
  remove() {
    this.loading.removePending = true;
    return this.$q.all([
      this.api.sms.jobs.delete({
        serviceName: this.$stateParams.serviceName,
        id: this.model.pendingSms.id,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removePending = false;
      this.removed = true;
      return this.$timeout(() => this.close(), 1500);
    }).catch(error => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
