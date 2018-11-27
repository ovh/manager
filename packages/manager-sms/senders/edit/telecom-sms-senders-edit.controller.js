angular.module('managerApp').controller('TelecomSmsSendersEditCtrl', class TelecomSmsSendersEditCtrl {
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
      editSender: false,
    };
    this.edited = false;
    this.model = {
      sender: angular.copy(this.sender),
    };
    this.attributs = ['description', 'status'];
  }

  /**
     * Edit sender.
     * @return {Promise}
     */
  edit() {
    this.loading.editSender = true;
    return this.$q.all([
      this.api.sms.senders.edit({
        serviceName: this.$stateParams.serviceName,
        sender: this.model.sender.sender,
      }, _.pick(this.model.sender, this.attributs)).$promise.catch(error => this.$q.reject(error)),
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.editSender = false;
      this.edited = true;
      this.sender.description = this.model.sender.description;
      this.sender.status = this.model.sender.status;
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
      _.pick(this.model.sender, this.attributs),
      _.pick(this.sender, this.attributs),
    );
  }
});
