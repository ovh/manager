import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export default class VpsPasswordCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, ovhDocUrl,
    serviceName, VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhDocUrl = ovhDocUrl;
    this.serviceName = serviceName;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;

    this.selected = {
      rescue: true,
    };
  }

  $onInit() {
    this.guide = this.ovhDocUrl.getDocUrl('vps/root-password');
    this.tasks = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getTaskInError(this.serviceName)
        .then((tasks) => {
          if (isArray(tasks) && !isEmpty(tasks)) {
            this.CucCloudMessage.error(this.$translate.instant('vps_configuration_polling_fail'));
          }
        })
        .catch((err) => this.CucCloudMessage.error(err)),
    });
    return this.tasks.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.save = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.reboot(this.serviceName, this.selected.rescue)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('vps_configuration_reboot_rescue_success', { serviceName: this.serviceName })))
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_reinitpassword_fail')))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.save.load();
  }
}
