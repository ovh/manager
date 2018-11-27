angular.module('managerApp').controller('TelecomSmsSmsTemplateRelaunchCtrl', class TelecomSmsSmsTemplateRelaunchCtrl {
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
      relaunchTemplate: false,
    };
    this.relaunched = false;
    this.model = {
      template: angular.copy(this.template),
    };
    this.availableActivities = [];
  }

  /**
     * Relaunch templates.
     * @return {Promise}
     */
  relaunch() {
    this.loading.removeTemplate = true;
    return this.$q.all([
      this.api.sms.templates.relaunchValidation({
        serviceName: this.$stateParams.serviceName,
        name: this.model.template.name,
      }, {
        description: this.model.template.description,
        message: this.model.template.message,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.relaunchTemplate = false;
      this.relaunched = true;
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
