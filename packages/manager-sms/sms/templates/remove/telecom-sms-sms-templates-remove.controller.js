angular.module('managerApp').controller('TelecomSmsSmsTemplateRemoveCtrl', class TelecomSmsSmsTemplateRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, template) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        templates: OvhApiSms.Templates().v6(),
      },
    };
    this.template = template;
  }

  $onInit() {
    this.loading = {
      removeTemplate: false,
    };
    this.removed = false;
    this.model = {
      template: angular.copy(this.template),
    };
  }

  /**
     * Remove templates.
     * @return {Promise}
     */
  remove() {
    this.loading.removeTemplate = true;
    return this.$q.all([
      this.api.sms.templates.delete({
        serviceName: this.$stateParams.serviceName,
        name: this.model.template.name,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeTemplate = false;
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
