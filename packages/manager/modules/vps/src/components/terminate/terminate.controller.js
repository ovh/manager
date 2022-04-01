import 'moment';
import {
  TITLES,
  TERMINATE_INFO,
  TRACKING_INFO,
  TRACKING_PREFIX,
  TERMINATE_SUCCESS_INFO,
} from './terminate.constants';

export default class VpsOptionTerminateCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucControllerHelper,
    CucCloudMessage,
    VpsService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
    this.CucControllerHelper = CucControllerHelper;

    this.TITLES = TITLES;
    this.TERMINATE_INFO = TERMINATE_INFO;
  }

  $onInit() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.atInternet.trackPage({
        name: `${TRACKING_PREFIX}::${TRACKING_INFO[this.vpsOption]}`,
      });
    }
    this.selectedVps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getSelectedVps(this.serviceName)
          .then((vps) => {
            this.expirationDate = moment(vps.expiration).format('LL');
            return this.expirationDate;
          })
          .catch(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_cancel_option_cancel_error',
              ),
            ),
          ),
    });
    this.selectedVps.load();
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${TRACKING_INFO[this.vpsOption]}::${hit}`,
      type: 'action',
    });
  }

  cancel() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.trackClick('cancel');
    }
    this.goBack();
  }

  confirm() {
    if (TRACKING_INFO[this.vpsOption]) {
      this.trackClick('confirm');
    }
    this.CucCloudMessage.flushChildMessage();
    this.terminate = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.cancelOption(this.serviceName, this.vpsOption)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(TERMINATE_SUCCESS_INFO[this.vpsOption]),
            ),
          )
          .catch((err) =>
            this.CucCloudMessage.error(
              err.message ||
                this.$translate.instant(
                  'vps_configuration_cancel_option_cancel_error',
                ),
            ),
          )
          .finally(() => this.goBack()),
    });
    return this.terminate.load();
  }
}
