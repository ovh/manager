angular.module('managerApp').controller('TelecomSmsSendersTerminateCtrl', class TelecomSmsSendersTerminateCtrl {
  constructor($q, $timeout, $uibModalInstance, OvhApiSms, sender) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        virtualNumbers: OvhApiSms.VirtualNumbers().v6(),
      },
    };
    this.sender = sender;
  }

  $onInit() {
    this.loading = {
      terminate: false,
    };
    this.terminated = false;
    this.model = {
      sender: angular.copy(this.sender),
    };
    this.number = _.get(this.sender, 'serviceInfos.domain');
  }

  /**
     * Terminate a virtual number.
     * @return {Promise}
     */
  terminate() {
    this.loading.terminate = true;
    return this.$q.all([
      this.api.sms.virtualNumbers.updateVirtualNumbersServiceInfos({
        number: this.number,
      }, { renew: this.getRenewInfos() }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.terminate = false;
      this.terminated = true;
      return this.$timeout(() => this.close(), 1500);
    }).catch(error => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  /**
     * Get renew infos helper.
     * @return {Object}
     */
  getRenewInfos() {
    return {
      automatic: this.model.sender.serviceInfos.renew.automatic,
      deleteAtExpiration: !this.model.sender.serviceInfos.renew.deleteAtExpiration,
      forced: this.model.sender.serviceInfos.renew.forced,
      period: this.model.sender.serviceInfos.renew.period,
    };
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
