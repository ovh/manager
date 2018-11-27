angular.module('managerApp').controller('TelecomSmsUsersChangePasswordCtrl', class TelecomSmsUsersChangePasswordCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, user) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        users: OvhApiSms.Users().v6(),
      },
    };
    this.user = user;
  }

  $onInit() {
    this.loading = {
      changePasswordUser: false,
    };
    this.changed = false;
    this.attributes = ['password'];
    this.model = {
      user: _.pick(angular.copy(this.user), 'login'),
    };
    this.passwordPattern = /^\w{8}$/;
  }

  /**
     * Change password from sms api user.
     * @return {Promise}
     */
  changePassword() {
    this.loading.changePasswordUser = true;
    return this.$q.all([
      this.api.sms.users.edit({
        serviceName: this.$stateParams.serviceName,
        login: this.user.login,
      }, _.pick(this.model.user, this.attributes)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.changePasswordUser = false;
      this.changed = true;
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
