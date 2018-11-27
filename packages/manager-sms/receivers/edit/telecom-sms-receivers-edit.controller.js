angular.module('managerApp').controller('TelecomSmsReceiversEditCtrl', class TelecomSmsReceiversEditCtrl {
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
      editReceiver: false,
    };
    this.edited = false;
    this.model = {
      receiver: angular.copy(this.receiver),
    };
    this.attributes = ['autoUpdate', 'description'];
  }

  /**
     * Edit receivers' list.
     * @return {Promise}
     */
  edit() {
    this.loading.editReceiver = true;
    return this.$q.all([
      this.api.sms.receivers.edit({
        serviceName: this.$stateParams.serviceName,
        slotId: this.model.receiver.slotId,
      }, _.pick(this.model.receiver, this.attributes)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.editReceiver = false;
      this.edited = true;
      return this.$timeout(() => this.close(), 1000);
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

  /**
     * Has changed helper.
     * @return {Boolean}
     */
  hasChanged() {
    return !_.isEqual(
      _.pick(this.model.receiver, this.attributes),
      _.pick(this.receiver, this.attributes),
    );
  }
});
