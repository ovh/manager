import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export default class VpsRebootCtrl {
  /* @ngInject */
  constructor($translate, CucControllerHelper, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;

    this.loader = {
      init: false,
    };
    this.model = {};
    this.selected = {
      rescue: false,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.VpsService.getTaskInError(this.serviceName).then((tasks) => {
      this.loadVpsRescueMode(tasks);
    });
  }

  loadVpsRescueMode(tasks) {
    if (!isArray(tasks) || (isArray(tasks) && isEmpty(tasks))) {
      this.VpsService.getSelectedVps(this.serviceName)
        .then((data) => {
          this.model = data;
        })
        .catch((err) =>
          this.CucCloudMessage.error(
            this.$translate.instant('vps_configuration_reboot_fail', {
              error: err?.message,
            }),
          ),
        )
        .finally(() => {
          this.loader.init = false;
        });
    } else {
      this.CucCloudMessage.error(
        this.$translate.instant('vps_configuration_polling_fail'),
      );
      this.loader.init = false;
    }
  }

  cancel() {
    return this.goBack();
  }

  confirm() {
    this.save = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.reboot(this.serviceName, this.selected.rescue)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant('vps_configuration_reboot_success', {
                serviceName: this.serviceName,
              }),
            ),
          )
          .catch((err) =>
            this.CucCloudMessage.error(
              this.$translate.instant('vps_configuration_reboot_fail', {
                error: err?.message,
              }),
            ),
          )
          .finally(() => this.cancel()),
    });
    return this.save.load();
  }
}
