angular.module('managerApp').controller('TelecomSmsSmsIncomingRemoveCtrl', class TelecomSmsSmsIncomingRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, incomingSms) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        incoming: OvhApiSms.Incoming().v6(),
      },
    };
    this.incomingSms = incomingSms;
  }

  $onInit() {
    this.loading = {
      removeIncoming: false,
    };
    this.removed = false;
  }

  /**
     * Remove incoming sms.
     * @return {Promise}
     */
  remove() {
    this.loading.removeIncoming = true;
    return this.$q.all([
      this.api.sms.incoming.delete({
        serviceName: this.$stateParams.serviceName,
        id: this.incomingSms.id,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeIncoming = false;
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
