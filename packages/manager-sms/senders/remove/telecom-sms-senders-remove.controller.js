angular.module('managerApp').controller('TelecomSmsSendersRemoveCtrl', class TelecomSmsSendersRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, sender) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        senders: OvhApiSms.Senders().v6(),
      },
    };
    this.sender = sender;
  }

  $onInit() {
    this.loading = {
      removeSender: false,
    };
    this.removed = false;
  }

  /**
     * Remove sender.
     * @return {Promise}
     */
  remove() {
    this.loading.removeSender = true;
    return this.$q.all([
      this.api.sms.senders.delete({
        serviceName: this.$stateParams.serviceName,
        sender: this.sender.sender,
      }).$promise.catch(error => this.$q.reject(error)),
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeSender = false;
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
