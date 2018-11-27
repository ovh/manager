angular.module('managerApp').controller('TelecomSmsOptionsManageUpdateCtrl', class TelecomSmsOptionsManageUpdateCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, service) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: OvhApiSms.v6(),
    };
    this.service = service;
  }

  $onInit() {
    this.loading = {
      updateOptions: false,
    };
    this.updated = false;
    this.model = {
      service: angular.copy(this.service),
    };
    this.urlPattern = /^(https?):\/\/.*$/;
    this.attributs = ['callBack', 'stopCallBack'];
  }

  /**
     * Set callBack and stopCallBack URL.
     * @return {Promise}
     */
  setUrls() {
    this.loading.updateOptions = true;
    return this.$q.all([
      this.api.sms.put({
        serviceName: this.$stateParams.serviceName,
      }, _.pick(this.model.service, this.attributs)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.updateOptions = false;
      this.updated = true;
      this.service.callBack = this.model.service.callBack;
      this.service.stopCallBack = this.model.service.stopCallBack;
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

  /**
     * Has changed helper.
     * @return {Boolean}
     */
  hasChanged() {
    return !_.isEqual(
      _.pick(this.model.service, this.attributs),
      _.pick(this.service, this.attributs),
    );
  }
});
