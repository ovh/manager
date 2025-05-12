import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { VPS_PASSWORD_GUIDE_URL } from './vps-password.constants';

export default class VpsPasswordCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    coreConfig,
    ovhDocUrl,
    VpsService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhDocUrl = ovhDocUrl;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;

    this.selected = {
      rescue: true,
    };
  }

  $onInit() {
    this.guide =
      VPS_PASSWORD_GUIDE_URL[this.ovhSubsidiary] ||
      VPS_PASSWORD_GUIDE_URL.DEFAULT;
    this.tasks = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getTaskInError(this.serviceName)
          .then((tasks) => {
            if (isArray(tasks) && !isEmpty(tasks)) {
              this.CucCloudMessage.error(
                this.$translate.instant('vps_configuration_polling_fail'),
              );
            }
          })
          .catch((err) => this.CucCloudMessage.error(err)),
    });
    return this.tasks.load();
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
              this.$translate.instant(
                'vps_configuration_reboot_rescue_success',
                { serviceName: this.serviceName },
              ),
            ),
          )
          .catch(() =>
            this.CucCloudMessage.error(
              this.$translate.instant('vps_configuration_reinitpassword_fail'),
            ),
          )
          .finally(() => this.cancel()),
    });
    return this.save.load();
  }
}
