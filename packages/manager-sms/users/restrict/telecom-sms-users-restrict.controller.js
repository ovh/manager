angular.module('managerApp').controller('TelecomSmsUsersRestrictByIpCtrl', class TelecomSmsUsersRestrictByIpCtrl {
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
      restrictByIpUser: false,
    };
    this.restricted = false;
    this.ipRestrictions = {
      threshold: 5,
      pattern: /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/,
    };
    this.model = {
      user: angular.copy(this.user),
    };

    while (this.model.user.ipRestrictions.length < this.ipRestrictions.threshold) {
      this.model.user.ipRestrictions.push('');
    }
  }

  /**
     * Set sms api user restrict.
     * @return {Promise}
     */
  restrict() {
    this.loading.restrictByIpUser = true;
    return this.$q.all([
      this.api.sms.users.edit({
        serviceName: this.$stateParams.serviceName,
        login: this.model.user.login,
      }, {
        ipRestrictions: _.without(this.model.user.ipRestrictions, ''),
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.restrictByIpUser = false;
      this.restricted = true;
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
    return !_.isEqual(_.without(this.model.user.ipRestrictions, ''), this.user.ipRestrictions);
  }
});
