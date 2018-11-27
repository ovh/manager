angular.module('managerApp').controller('TelecomSmsSendersBlacklistedRemoveCtrl', class TelecomSmsSendersBlacklistedRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, blacklist) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        blacklists: OvhApiSms.Blacklists().v6(),
      },
    };
    this.blacklist = blacklist;
  }

  $onInit() {
    this.loading = {
      removeBlacklisted: false,
    };
    this.removed = false;
  }

  /**
     * Remove blacklists.
     * @return {Promise}
     */
  remove() {
    this.loading.removeBlacklisted = true;
    return this.$q.all([
      this.api.sms.blacklists.delete({
        serviceName: this.$stateParams.serviceName,
        number: this.blacklist.number,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeBlacklisted = false;
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
