angular.module('managerApp').controller('TelecomSmsUsersAddCtrl', class TelecomSmsUsersAddCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        users: OvhApiSms.Users().v6(),
      },
    };
  }

  $onInit() {
    this.loading = {
      addUser: false,
    };
    this.added = false;
    this.user = null;
    this.attributes = ['login', 'password'];
  }

  /**
     * Add sms api user.
     * @return {Promise}
     */
  add() {
    this.loading.addUser = true;
    return this.$q.all([
      this.api.sms.users.create({
        serviceName: this.$stateParams.serviceName,
      }, _.pick(this.user, this.attributes)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.addUser = false;
      this.added = true;
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
});
