angular.module('managerApp').controller('TelecomSmsReceiversRemoveCtrl', class TelecomSmsReceiversRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, receiver) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        receivers: OvhApiSms.Receivers().v6(),
      },
    };
    this.receiver = receiver;
  }

  $onInit() {
    this.loading = {
      removeReceiver: false,
    };
    this.removed = false;
  }

  /**
     * Remove receiver's list.
     * @return {Promise}
     */
  remove() {
    this.loading.removeReceiver = true;
    return this.$q.all([
      this.api.sms.receivers.delete({
        serviceName: this.$stateParams.serviceName,
        slotId: this.receiver.slotId,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeReceiver = false;
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
