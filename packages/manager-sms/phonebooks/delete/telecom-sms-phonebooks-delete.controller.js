angular.module('managerApp').controller('TelecomSmsPhonebooksDeleteCtrl', class TelecomSmsPhonebooksDeleteCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, phonebook, OvhApiSms) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.phonebook = phonebook;
    this.api = {
      sms: {
        phonebooks: OvhApiSms.Phonebooks().v6(),
      },
    };
  }

  $onInit() {
    this.model = {
      phonebook: angular.copy(this.phonebook),
    };
    this.isDeleting = false;
    this.deleted = false;
  }

  /**
     * Delete phonebook.
     * @return {Promise}
     */
  delete() {
    this.isDeleting = true;
    return this.$q.all([
      this.api.sms.phonebooks.delete({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebook, 'bookKey'),
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.isDeleting = false;
      this.deleted = true;
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
